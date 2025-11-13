<template>
  <div class="login-container">
    <div class="login-card">
      <!-- Заголовок -->
      <div class="login-header">
        <h1 class="login-title">Defect Control</h1>
        <p class="login-subtitle">Система управления дефектами</p>
      </div>

      <!-- Форма логина -->
      <LoginForm />

      <!-- Информация о тестовых пользователях -->
      <div class="test-users-info">
        <h3>Тестовые пользователи:</h3>
        <div class="users-list">
          <div class="user-item">
            <span class="user-role">Менеджер</span>
            <span class="user-credentials">manager@company.com / Manager123!</span>
          </div>
          <div class="user-item">
            <span class="user-role">Инженер</span>
            <span class="user-credentials">engineer@company.com / Engineer123!</span>
          </div>
          <div class="user-item">
            <span class="user-role">Наблюдатель</span>
            <span class="user-credentials">observer@company.com / Observer123!</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from '@/components/LoginForm.vue'

export default {
  name: 'LoginView',
  components: {
    LoginForm
  }
}
</script>

<style scoped>
.login-container {
  padding: 20px;
  width: 100%;
  max-width: 500px;
}

.login-card {
  background: white;
  border-radius: 12px;
  padding: 40px 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-title {
  color: #2d3748;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
}

.login-subtitle {
  color: #718096;
  font-size: 16px;
}

.test-users-info {
  margin-top: 30px;
  padding: 20px;
  background: #f7fafc;
  border-radius: 8px;
  border-left: 4px solid #4299e1;
}

.test-users-info h3 {
  color: #2d3748;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
}

.users-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e2e8f0;
}

.user-item:last-child {
  border-bottom: none;
}

.user-role {
  font-weight: 600;
  color: #4a5568;
  font-size: 13px;
}

.user-credentials {
  color: #718096;
  font-size: 12px;
  font-family: monospace;
}

@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
  }
  
  .user-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>