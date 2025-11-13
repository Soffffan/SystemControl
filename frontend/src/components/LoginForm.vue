<template>
  <form @submit.prevent="handleLogin" class="login-form">
    <!-- Поле email -->
    <div class="form-group">
      <label for="email" class="form-label">Email</label>
      <input
        id="email"
        v-model="form.email"
        type="email"
        class="form-input"
        :class="{ 'error': errors.email }"
        placeholder="Введите ваш email"
        required
      />
      <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
    </div>

    <!-- Поле пароля -->
    <div class="form-group">
      <label for="password" class="form-label">Пароль</label>
      <input
        id="password"
        v-model="form.password"
        type="password"
        class="form-input"
        :class="{ 'error': errors.password }"
        placeholder="Введите ваш пароль"
        required
      />
      <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
    </div>

    <!-- Сообщение об ошибке -->
    <div v-if="error" class="alert alert-error">
      {{ error }}
    </div>

    <!-- Сообщение об успехе -->
    <div v-if="message" class="alert alert-success">
      {{ message }}
    </div>

    <!-- Кнопка входа -->
    <button 
      type="submit" 
      class="login-button"
      :disabled="loading"
    >
      <span v-if="loading" class="button-loading">
        <div class="spinner"></div>
        Вход...
      </span>
      <span v-else>Войти в систему</span>
    </button>

    <!-- Индикатор загрузки -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner-large"></div>
    </div>
  </form>
</template>

<script>
import { authService } from '@/services/api'

export default {
  name: 'LoginForm',
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      errors: {},
      loading: false,
      error: '',
      message: ''
    }
  },
  methods: {
    async handleLogin() {
      setTimeout(() => {
        this.$router.push('/dashboard')
      }, 1000)
      // Валидация
      this.errors = {}
      
      if (!this.form.email) {
        this.errors.email = 'Email обязателен'
      } else if (!this.isValidEmail(this.form.email)) {
        this.errors.email = 'Введите корректный email'
      }
      
      if (!this.form.password) {
        this.errors.password = 'Пароль обязателен'
      }
      
      if (Object.keys(this.errors).length > 0) {
        return
      }

      this.loading = true
      this.error = ''
      this.message = ''

      try {
        const response = await authService.login(this.form)
        
        if (response.token) {
          this.message = 'Вход выполнен успешно!'
          
          // Сохраняем токен и пользователя
          localStorage.setItem('token', response.token)
          localStorage.setItem('user', JSON.stringify(response.user))
          
          // Редирект на главную страницу
          setTimeout(() => {
            this.$router.push('/dashboard')
          }, 1000)
        }
      } catch (error) {
        this.error = error.response?.data?.error || 'Ошибка при входе в систему'
        console.error('Login error:', error)
      } finally {
        this.loading = false
      }
    },
    
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    }
  }
}
</script>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  color: #4a5568;
  font-weight: 600;
  margin-bottom: 6px;
  font-size: 14px;
}

.form-input {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: #fff;
}

.form-input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.form-input.error {
  border-color: #e53e3e;
  box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
}

.error-message {
  color: #e53e3e;
  font-size: 12px;
  margin-top: 4px;
}

.login-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 14px 20px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.button-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.alert {
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
}

.alert-error {
  background: #fed7d7;
  color: #c53030;
  border: 1px solid #feb2b2;
}

.alert-success {
  background: #c6f6d5;
  color: #276749;
  border: 1px solid #9ae6b4;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.spinner-large {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #4299e1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
</style>