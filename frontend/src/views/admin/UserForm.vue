<template>
  <div class="user-form">
    <div class="form-header">
      <h2>{{ isEdit ? 'Редактирование пользователя' : 'Создание пользователя' }}</h2>
      <button @click="$router.back()" class="btn-back">Назад</button>
    </div>

    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-group">
        <label for="fullName" class="form-label">ФИО *</label>
        <input
          id="fullName"
          v-model="form.fullName"
          type="text"
          class="form-input"
          :class="{ 'error': errors.fullName }"
          placeholder="Введите полное имя"
          required
        />
        <div v-if="errors.fullName" class="error-message">{{ errors.fullName }}</div>
      </div>

      <div class="form-group">
        <label for="email" class="form-label">Email *</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          class="form-input"
          :class="{ 'error': errors.email }"
          placeholder="Введите email"
          required
        />
        <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
      </div>

      <div class="form-group">
        <label for="password" class="form-label">
          {{ isEdit ? 'Новый пароль (оставьте пустым, если не меняется)' : 'Пароль *' }}
        </label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          class="form-input"
          :class="{ 'error': errors.password }"
          :placeholder="isEdit ? 'Введите новый пароль' : 'Введите пароль'"
          :required="!isEdit"
        />
        <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
      </div>

      <div class="form-group">
        <label for="roleId" class="form-label">Роль *</label>
        <select
          id="roleId"
          v-model="form.roleId"
          class="form-select"
          :class="{ 'error': errors.roleId }"
          required
        >
          <option value="">Выберите роль</option>
          <option v-for="role in roles" :key="role.id" :value="role.id">
            {{ getRoleName(role.name) }}
          </option>
        </select>
        <div v-if="errors.roleId" class="error-message">{{ errors.roleId }}</div>
      </div>

      <div v-if="isEdit" class="form-group">
        <label class="checkbox-label">
          <input
            v-model="form.isActive"
            type="checkbox"
            class="checkbox"
          />
          <span class="checkmark"></span>
          Активный пользователь
        </label>
      </div>

      <div class="form-actions">
        <button type="button" @click="$router.back()" class="btn-cancel">
          Отмена
        </button>
        <button type="submit" :disabled="loading" class="btn-submit">
          <span v-if="loading">Сохранение...</span>
          <span v-else>{{ isEdit ? 'Сохранить' : 'Создать' }}</span>
        </button>
      </div>

      <div v-if="error" class="alert alert-error">
        {{ error }}
      </div>

      <div v-if="message" class="alert alert-success">
        {{ message }}
      </div>
    </form>
  </div>
</template>

<script>
import { userService } from '@/services/userService';

export default {
  name: 'UserForm',
  props: {
    userId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      form: {
        fullName: '',
        email: '',
        password: '',
        roleId: '',
        isActive: true
      },
      roles: [
        { id: 1, name: 'manager' },
        { id: 2, name: 'engineer' },
        { id: 3, name: 'observer' }
      ],
      errors: {},
      loading: false,
      error: '',
      message: ''
    };
  },
  computed: {
    isEdit() {
      return this.userId !== null;
    }
  },
  async mounted() {
    if (this.isEdit) {
      await this.loadUser();
    }
  },
  methods: {
    async loadUser() {
      try {
        this.loading = true;
        const user = await userService.getUserById(this.userId);
        
        if (user) {
          this.form = {
            fullName: user.fullName,
            email: user.email,
            password: '',
            roleId: user.roleId,
            isActive: user.isActive
          };
        }
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    validateForm() {
      this.errors = {};

      if (!this.form.fullName.trim()) {
        this.errors.fullName = 'ФИО обязательно';
      } else if (this.form.fullName.trim().length < 2) {
        this.errors.fullName = 'ФИО должно быть не менее 2 символов';
      }

      if (!this.form.email.trim()) {
        this.errors.email = 'Email обязателен';
      } else if (!this.isValidEmail(this.form.email)) {
        this.errors.email = 'Введите корректный email';
      }

      if (!this.isEdit && !this.form.password) {
        this.errors.password = 'Пароль обязателен';
      } else if (this.form.password && this.form.password.length < 6) {
        this.errors.password = 'Пароль должен быть не менее 6 символов';
      } else if (this.form.password && !this.isValidPassword(this.form.password)) {
        this.errors.password = 'Пароль должен содержать заглавные, строчные буквы и цифры';
      }

      if (!this.form.roleId) {
        this.errors.roleId = 'Выберите роль';
      }

      return Object.keys(this.errors).length === 0;
    },

    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    isValidPassword(password) {
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password);
    },

    getRoleName(roleName) {
      const roles = {
        'manager': 'Менеджер',
        'engineer': 'Инженер',
        'observer': 'Наблюдатель'
      };
      return roles[roleName] || roleName;
    },

    async handleSubmit() {
      if (!this.validateForm()) {
        return;
      }

      this.loading = true;
      this.error = '';
      this.message = '';

      try {
        const formData = { ...this.form };
        
        // Если пароль пустой при редактировании, не отправляем его
        if (this.isEdit && !formData.password) {
          delete formData.password;
        }

        if (this.isEdit) {
          await userService.updateUser(this.userId, formData);
          this.message = 'Пользователь успешно обновлен';
        } else {
          await userService.createUser(formData);
          this.message = 'Пользователь успешно создан';
        }

        // Через 2 секунды возвращаемся к списку
        setTimeout(() => {
          this.$router.push('/admin/users');
        }, 2000);

      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.user-form {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px;
  border-bottom: 1px solid #e2e8f0;
}

.form-header h2 {
  color: #2d3748;
  margin: 0;
  font-size: 20px;
}

.btn-back {
  background: #718096;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s ease;
}

.btn-back:hover {
  background: #4a5568;
}

.form {
  padding: 30px;
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

.form-input,
.form-select {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: #fff;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.form-input.error,
.form-select.error {
  border-color: #e53e3e;
  box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
}

.error-message {
  color: #e53e3e;
  font-size: 12px;
  margin-top: 4px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 10px;
}

.checkbox {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #e2e8f0;
  border-radius: 4px;
  position: relative;
  transition: all 0.3s ease;
}

.checkbox:checked + .checkmark {
  background: #4299e1;
  border-color: #4299e1;
}

.checkbox:checked + .checkmark::after {
  content: '✓';
  color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  font-weight: bold;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 10px;
}

.btn-cancel {
  background: #a0aec0;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s ease;
}

.btn-cancel:hover {
  background: #718096;
}

.btn-submit {
  background: #4299e1;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s ease;
}

.btn-submit:hover:not(:disabled) {
  background: #3182ce;
}

.btn-submit:disabled {
  background: #a0aec0;
  cursor: not-allowed;
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

@media (max-width: 768px) {
  .form-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .form {
    padding: 20px;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>