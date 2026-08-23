const request = require('supertest');
const { app } = require('../src/server');

// Set adequate timeout for remote Supabase operations
jest.setTimeout(30000);

describe('ProjectManager API Integration Tests', () => {
  let createdProjectId = null;
  let createdTaskId = null;
  let createdCommentId = null;

  const mockUserHeaders = {
    'x-mock-user-id': 'user_test_codealpha_123',
    'x-mock-user-email': 'tester@codealpha.com',
    'x-mock-user-name': 'CodeAlpha Tester',
  };

  const otherUserHeaders = {
    'x-mock-user-id': 'user_test_other_456',
    'x-mock-user-email': 'other@codealpha.com',
    'x-mock-user-name': 'Other User',
  };

  describe('1. Health Check Endpoint', () => {
    it('GET /api/health should return 200 OK and status ok', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.service).toBe('ProjectManager API');
    });
  });

  describe('2. Project Endpoints', () => {
    it('POST /api/projects should create a project for authenticated user', async () => {
      const res = await request(app)
        .post('/api/projects')
        .set(mockUserHeaders)
        .send({
          name: 'Jest Test Project',
          description: 'Automated test project for CI/CD',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.name).toBe('Jest Test Project');

      createdProjectId = res.body.data.id;
    });

    it('POST /api/projects should reject missing project name', async () => {
      const res = await request(app)
        .post('/api/projects')
        .set(mockUserHeaders)
        .send({
          description: 'No name given',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('GET /api/projects should list user projects', async () => {
      const res = await request(app)
        .get('/api/projects')
        .set(mockUserHeaders);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      const found = res.body.data.find((p) => p.id === createdProjectId);
      expect(found).toBeDefined();
      expect(found.isOwner).toBe(true);
    });

    it('GET /api/projects/:id should fetch project details & members', async () => {
      const res = await request(app)
        .get(`/api/projects/${createdProjectId}`)
        .set(mockUserHeaders);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(createdProjectId);
      expect(Array.isArray(res.body.data.members)).toBe(true);
    });

    it('PUT /api/projects/:id should update project info', async () => {
      const res = await request(app)
        .put(`/api/projects/${createdProjectId}`)
        .set(mockUserHeaders)
        .send({
          name: 'Updated Jest Test Project',
          description: 'Updated description',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Updated Jest Test Project');
    });

    it('GET /api/projects/:id should deny access to unauthorized non-member', async () => {
      const res = await request(app)
        .get(`/api/projects/${createdProjectId}`)
        .set(otherUserHeaders);

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  describe('3. Task Endpoints', () => {
    it('POST /api/tasks should create a task in the project', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set(mockUserHeaders)
        .send({
          projectId: createdProjectId,
          title: 'Initial Setup Task',
          description: 'Configure CI/CD pipelines',
          status: 'todo',
          priority: 'high',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Initial Setup Task');
      expect(res.body.data.status).toBe('todo');
      expect(res.body.data.priority).toBe('high');

      createdTaskId = res.body.data.id;
    });

    it('GET /api/tasks/project/:projectId should list all project tasks', async () => {
      const res = await request(app)
        .get(`/api/tasks/project/${createdProjectId}`)
        .set(mockUserHeaders);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it('PUT /api/tasks/:id should update task status to in_progress or done', async () => {
      const res = await request(app)
        .put(`/api/tasks/${createdTaskId}`)
        .set(mockUserHeaders)
        .send({
          status: 'in_progress',
          priority: 'medium',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('in_progress');
      expect(res.body.data.priority).toBe('medium');
    });
  });

  describe('4. Comments Endpoints', () => {
    it('POST /api/comments should add a comment to a task', async () => {
      const res = await request(app)
        .post('/api/comments')
        .set(mockUserHeaders)
        .send({
          taskId: createdTaskId,
          content: 'This task is making great progress!',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.content).toBe('This task is making great progress!');
      expect(res.body.data.author).toBeDefined();

      createdCommentId = res.body.data.id;
    });

    it('GET /api/comments/task/:taskId should list task comments in order', async () => {
      const res = await request(app)
        .get(`/api/comments/task/${createdTaskId}`)
        .set(mockUserHeaders);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it('DELETE /api/comments/:id should delete the comment', async () => {
      const res = await request(app)
        .delete(`/api/comments/${createdCommentId}`)
        .set(mockUserHeaders);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('5. Clean up & Deletion', () => {
    it('DELETE /api/tasks/:id should delete task', async () => {
      const res = await request(app)
        .delete(`/api/tasks/${createdTaskId}`)
        .set(mockUserHeaders);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('DELETE /api/projects/:id should delete project and cascade', async () => {
      const res = await request(app)
        .delete(`/api/projects/${createdProjectId}`)
        .set(mockUserHeaders);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
