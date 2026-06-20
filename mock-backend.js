const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 8080;
const JWT_SECRET = 'HackMateSecretKeyForJWTTokenGenerationMustBeAtLeast256BitsLong123456789';

// Middleware
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'], credentials: true }));
app.use(express.json());

// Mock Database
let users = [
  {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    fullName: 'Test User',
    bio: 'Full-stack developer | Hackathon enthusiast 🏆',
    college: 'Indian Institute of Technology',
    branch: 'Computer Science',
    year: 2025,
    experienceLevel: 'Intermediate',
    githubUrl: 'https://github.com/testuser',
    linkedinUrl: 'https://linkedin.com/in/testuser',
    portfolioUrl: 'https://testuser.dev',
    skills: ['React', 'Java', 'JavaScript'],
    rating: 4.5,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    username: 'alice_dev',
    email: 'alice@example.com',
    password: 'alice123',
    fullName: 'Alice Chen',
    bio: 'AI/ML Engineer 🌍 | Love building smart solutions',
    college: 'Stanford University',
    branch: 'Artificial Intelligence',
    year: 2024,
    experienceLevel: 'Advanced',
    githubUrl: 'https://github.com/alice-dev',
    linkedinUrl: 'https://linkedin.com/in/alicechen',
    portfolioUrl: 'https://alicechen.dev',
    skills: ['Python', 'TensorFlow', 'React', 'Machine Learning'],
    rating: 4.8,
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    username: 'bob_coder',
    email: 'bob@example.com',
    password: 'bob123',
    fullName: 'Bob Smith',
    bio: 'Backend Architect | Passionate about scalability',
    college: 'MIT',
    branch: 'Computer Engineering',
    year: 2023,
    experienceLevel: 'Advanced',
    githubUrl: 'https://github.com/bob-coder',
    linkedinUrl: 'https://linkedin.com/in/bobsmith',
    portfolioUrl: 'https://bobsmith.dev',
    skills: ['Node.js', 'Python', 'Docker', 'Spring Boot'],
    rating: 4.7,
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    username: 'charlie_ui',
    email: 'charlie@example.com',
    password: 'charlie123',
    fullName: 'Charlie Kim',
    bio: 'UI/UX Designer & Frontend Developer ✨',
    college: 'NYU',
    branch: 'Design',
    year: 2026,
    experienceLevel: 'Beginner',
    githubUrl: 'https://github.com/charlie-ui',
    linkedinUrl: 'https://linkedin.com/in/charliekim',
    portfolioUrl: 'https://charliekim.dev',
    skills: ['React', 'Figma', 'Tailwind', 'UI/UX'],
    rating: 4.6,
    createdAt: new Date().toISOString()
  }
];

let projects = [
  {
    id: 1,
    title: 'DevFlow AI',
    description: 'AI-powered productivity tool for developers with code completion and project management features',
    category: 'AI/ML',
    techStack: ['React', 'Python', 'TensorFlow'],
    requiredSkills: ['React', 'Python', 'TensorFlow', 'Machine Learning'],
    teamSize: 4,
    hackathonName: 'Smart India Hackathon 2026',
    ownerId: 2,
    ownerUsername: 'alice_dev',
    status: 'open',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 2,
    title: 'EcoTrack',
    description: 'Sustainable living app that tracks carbon footprint and suggests eco-friendly alternatives',
    category: 'Web Development',
    techStack: ['React', 'Node.js', 'MongoDB'],
    requiredSkills: ['React', 'Node.js', 'UI/UX'],
    teamSize: 5,
    hackathonName: 'HackCBS',
    ownerId: 4,
    ownerUsername: 'charlie_ui',
    status: 'open',
    createdAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 3,
    title: 'GameStats Pro',
    description: 'Real-time gaming analytics platform for competitive gamers',
    category: 'Web Development',
    techStack: ['Node.js', 'Docker', 'React'],
    requiredSkills: ['Node.js', 'Docker', 'Spring Boot'],
    teamSize: 3,
    hackathonName: 'Hack in the North',
    ownerId: 3,
    ownerUsername: 'bob_coder',
    status: 'closed',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

let applications = [];

let tasks = [];

let messages = [];

let hackathons = [
  {
    id: 1,
    name: 'Smart India Hackathon 2026',
    date: '2026-08-15',
    registrationLink: 'https://sih.gov.in',
    mode: 'Hybrid',
    location: 'India (Multiple Locations)'
  },
  {
    id: 2,
    name: 'HackCBS',
    date: '2026-09-20',
    registrationLink: 'https://hackcbs.tech',
    mode: 'Offline',
    location: 'New Delhi'
  },
  {
    id: 3,
    name: 'Devfolio x ETHIndia',
    date: '2026-11-05',
    registrationLink: 'https://ethindia.devfolio.co',
    mode: 'Online',
    location: 'Online (India)'
  },
  {
    id: 4,
    name: 'HackWithPI',
    date: '2026-10-10',
    registrationLink: 'https://hackwithpi.com',
    mode: 'Online',
    location: 'Online (India)'
  },
  {
    id: 5,
    name: 'Hack in the North',
    date: '2026-12-01',
    registrationLink: 'https://hackinthenorth.com',
    mode: 'Hybrid',
    location: 'Bangalore'
  },
  {
    id: 6,
    name: 'HackNITR',
    date: '2026-07-25',
    registrationLink: 'https://hacknitr.com',
    mode: 'Offline',
    location: 'Rourkela'
  },
  {
    id: 7,
    name: 'Google Solution Challenge India',
    date: '2026-09-01',
    registrationLink: 'https://developers.google.com/community/gdg-solution-challenge',
    mode: 'Online',
    location: 'Online (India)'
  },
  {
    id: 8,
    name: 'Microsoft Imagine Cup India',
    date: '2026-10-15',
    registrationLink: 'https://imaginecup.microsoft.com',
    mode: 'Hybrid',
    location: 'India'
  }
];

let notifications = [];

// Calculate Skill Match Percentage
const calculateSkillMatch = (userSkills, requiredSkills) => {
  if (!requiredSkills || requiredSkills.length === 0) return 0;
  const matchedSkills = userSkills.filter(skill => requiredSkills.includes(skill));
  return Math.round((matchedSkills.length / requiredSkills.length) * 100);
};

// Auth middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = users.find(u => u.id === decoded.id);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ============================================
// AUTH ENDPOINTS
// ============================================
app.post('/api/auth/register', (req, res) => {
  const { username, email, password, fullName, college, branch, year } = req.body;
  
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  const newUser = {
    id: users.length + 1,
    username,
    email,
    password,
    fullName: fullName || '',
    college: college || '',
    branch: branch || '',
    year: year || 2026,
    bio: '',
    experienceLevel: 'Beginner',
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
    skills: [],
    rating: 0,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  
  const token = jwt.sign({ username: newUser.username, id: newUser.id }, JWT_SECRET, { expiresIn: '7d' });
  
  const { password: _, ...userWithoutPassword } = newUser;
  res.json({ token, ...userWithoutPassword });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const token = jwt.sign({ username: user.username, id: user.id }, JWT_SECRET, { expiresIn: '7d' });
  
  const { password: _, ...userWithoutPassword } = user;
  res.json({ token, ...userWithoutPassword });
});

// ============================================
// USER ENDPOINTS
// ============================================
app.get('/api/users/me', authenticate, (req, res) => {
  const { password, ...userWithoutPassword } = req.user;
  res.json(userWithoutPassword);
});

app.get('/api/users/:username', (req, res) => {
  const user = users.find(u => u.username === req.params.username);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

app.put('/api/users/me', authenticate, (req, res) => {
  const { fullName, bio, college, branch, year, experienceLevel, githubUrl, linkedinUrl, portfolioUrl, skills } = req.body;
  const userIndex = users.findIndex(u => u.id === req.user.id);
  
  if (userIndex !== -1) {
    users[userIndex] = {
      ...users[userIndex],
      fullName: fullName !== undefined ? fullName : users[userIndex].fullName,
      bio: bio !== undefined ? bio : users[userIndex].bio,
      college: college !== undefined ? college : users[userIndex].college,
      branch: branch !== undefined ? branch : users[userIndex].branch,
      year: year !== undefined ? year : users[userIndex].year,
      experienceLevel: experienceLevel !== undefined ? experienceLevel : users[userIndex].experienceLevel,
      githubUrl: githubUrl !== undefined ? githubUrl : users[userIndex].githubUrl,
      linkedinUrl: linkedinUrl !== undefined ? linkedinUrl : users[userIndex].linkedinUrl,
      portfolioUrl: portfolioUrl !== undefined ? portfolioUrl : users[userIndex].portfolioUrl,
      skills: skills !== undefined ? skills : users[userIndex].skills
    };
  }
  
  const { password, ...userWithoutPassword } = users[userIndex];
  res.json(userWithoutPassword);
});

app.get('/api/users/search', (req, res) => {
  const skillsQuery = req.query.skills;
  let results = users.map(u => {
    const { password, ...rest } = u;
    return rest;
  });

  if (skillsQuery) {
    const searchSkills = Array.isArray(skillsQuery) ? skillsQuery : [skillsQuery];
    results = results.filter(user => 
      user.skills.some(skill => searchSkills.includes(skill))
    );
  }

  res.json(results);
});

app.get('/api/users', (req, res) => {
  const usersWithoutPasswords = users.map(u => {
    const { password, ...rest } = u;
    return rest;
  });
  res.json(usersWithoutPasswords);
});

// ============================================
// PROJECT ENDPOINTS
// ============================================
app.get('/api/projects', (req, res) => {
  const { skill, category, status } = req.query;
  let filteredProjects = projects;
  
  if (skill) {
    filteredProjects = filteredProjects.filter(p => p.requiredSkills.includes(skill));
  }
  if (category && category !== 'All') {
    filteredProjects = filteredProjects.filter(p => p.category === category);
  }
  if (status) {
    filteredProjects = filteredProjects.filter(p => p.status === status);
  }

  const projectsWithMatches = filteredProjects.map(project => {
    const owner = users.find(u => u.id === project.ownerId);
    return {
      ...project,
      owner
    };
  });
  
  res.json(projectsWithMatches);
});

app.get('/api/projects/:id', (req, res) => {
  const project = projects.find(p => p.id === parseInt(req.params.id));
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  const owner = users.find(u => u.id === project.ownerId);
  res.json({ ...project, owner });
});

app.get('/api/projects/:id/match', authenticate, (req, res) => {
  const project = projects.find(p => p.id === parseInt(req.params.id));
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  
  const matchPercentage = calculateSkillMatch(req.user.skills, project.requiredSkills);
  res.json({ matchPercentage });
});

app.post('/api/projects', authenticate, (req, res) => {
  const { title, description, category, techStack, requiredSkills, teamSize, hackathonName } = req.body;
  
  const newProject = {
    id: projects.length + 1,
    title,
    description: description || '',
    category: category || 'Web Development',
    techStack: techStack || [],
    requiredSkills: requiredSkills || [],
    teamSize: teamSize || 4,
    hackathonName: hackathonName || '',
    ownerId: req.user.id,
    ownerUsername: req.user.username,
    status: 'open',
    createdAt: new Date().toISOString()
  };
  
  projects.push(newProject);
  res.json(newProject);
});

app.get('/api/projects/my-projects', authenticate, (req, res) => {
  const myProjects = projects.filter(p => p.ownerId === req.user.id);
  res.json(myProjects);
});

// ============================================
// APPLICATION ENDPOINTS
// ============================================
app.post('/api/projects/:id/apply', authenticate, (req, res) => {
  const project = projects.find(p => p.id === parseInt(req.params.id));
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  
  const existingApplication = applications.find(app => 
    app.projectId === project.id && app.userId === req.user.id
  );
  
  if (existingApplication) {
    return res.status(400).json({ error: 'Already applied' });
  }

  const newApplication = {
    id: applications.length + 1,
    projectId: project.id,
    userId: req.user.id,
    username: req.user.username,
    message: req.body.message || 'I would love to join!',
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  applications.push(newApplication);
  
  notifications.push({
    id: notifications.length + 1,
    userId: project.ownerId,
    message: `${req.user.username} applied to your project "${project.title}"!`,
    read: false,
    createdAt: new Date().toISOString()
  });
  
  res.json(newApplication);
});

app.get('/api/projects/:id/applications', authenticate, (req, res) => {
  const project = projects.find(p => p.id === parseInt(req.params.id));
  if (!project || project.ownerId !== req.user.id) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  
  const projectApplications = applications
    .filter(app => app.projectId === project.id)
    .map(app => {
      const applicant = users.find(u => u.id === app.userId);
      return { ...app, applicant };
    });
  
  res.json(projectApplications);
});

app.post('/api/applications/:id/accept', authenticate, (req, res) => {
  const application = applications.find(app => app.id === parseInt(req.params.id));
  if (!application) {
    return res.status(404).json({ error: 'Application not found' });
  }
  
  const project = projects.find(p => p.id === application.projectId);
  if (!project || project.ownerId !== req.user.id) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  
  application.status = 'accepted';
  
  notifications.push({
    id: notifications.length + 1,
    userId: application.userId,
    message: `Your application for "${project.title}" was accepted!`,
    read: false,
    createdAt: new Date().toISOString()
  });
  
  res.json(application);
});

app.post('/api/applications/:id/reject', authenticate, (req, res) => {
  const application = applications.find(app => app.id === parseInt(req.params.id));
  if (!application) {
    return res.status(404).json({ error: 'Application not found' });
  }
  
  const project = projects.find(p => p.id === application.projectId);
  if (!project || project.ownerId !== req.user.id) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  
  application.status = 'rejected';
  
  notifications.push({
    id: notifications.length + 1,
    userId: application.userId,
    message: `Your application for "${project.title}" was rejected.`,
    read: false,
    createdAt: new Date().toISOString()
  });
  
  res.json(application);
});

// ============================================
// TASK ENDPOINTS
// ============================================
app.get('/api/projects/:id/tasks', (req, res) => {
  const projectTasks = tasks.filter(task => task.projectId === parseInt(req.params.id));
  res.json(projectTasks);
});

app.post('/api/projects/:id/tasks', authenticate, (req, res) => {
  const project = projects.find(p => p.id === parseInt(req.params.id));
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  
  const newTask = {
    id: tasks.length + 1,
    projectId: project.id,
    title: req.body.title,
    status: req.body.status || 'todo',
    assignedUser: req.body.assignedUser || null,
    createdAt: new Date().toISOString()
  };
  
  tasks.push(newTask);
  res.json(newTask);
});

app.put('/api/tasks/:id', authenticate, (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
  res.json(tasks[taskIndex]);
});

// ============================================
// MESSAGE ENDPOINTS
// ============================================
app.get('/api/projects/:id/messages', (req, res) => {
  const projectMessages = messages.filter(msg => msg.projectId === parseInt(req.params.id));
  res.json(projectMessages);
});

app.post('/api/projects/:id/messages', authenticate, (req, res) => {
  const project = projects.find(p => p.id === parseInt(req.params.id));
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  
  const newMessage = {
    id: messages.length + 1,
    projectId: project.id,
    senderId: req.user.id,
    senderUsername: req.user.username,
    content: req.body.content,
    timestamp: new Date().toISOString()
  };
  
  messages.push(newMessage);
  res.json(newMessage);
});

// ============================================
// NOTIFICATION ENDPOINTS
// ============================================
app.get('/api/notifications', authenticate, (req, res) => {
  const userNotifications = notifications.filter(n => n.userId === req.user.id);
  res.json(userNotifications);
});

app.put('/api/notifications/:id/read', authenticate, (req, res) => {
  const notification = notifications.find(n => n.id === parseInt(req.params.id) && n.userId === req.user.id);
  if (notification) {
    notification.read = true;
  }
  res.json(notification);
});

// ============================================
// HACKATHON ENDPOINTS
// ============================================
app.get('/api/hackathons', (req, res) => {
  res.json(hackathons);
});

// ============================================
// LEADERBOARD
// ============================================
app.get('/api/leaderboard', (req, res) => {
  const leaderboard = users
    .map(u => {
      const { password, ...rest } = u;
      return rest;
    })
    .sort((a, b) => b.rating - a.rating);
  
  res.json(leaderboard);
});

// ============================================
// PUBLIC ENDPOINTS
// ============================================
app.get('/api/public/health', (req, res) => {
  res.json({ status: 'UP', service: 'HackMate Mock API v2.0' });
});

app.listen(PORT, () => {
  console.log('🚀 HackMate Mock Backend running at http://localhost:' + PORT);
  console.log('📋 Test Account: testuser / password123');
});
