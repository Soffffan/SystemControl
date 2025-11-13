<template>
  <div class="users-view">
    <div class="view-header">
      <button @click="$router.push('/dashboard')" class="btn-back">
        ← 
      </button>
      <h1>Управление пользователями</h1>
    </div>

    <!-- Таблица пользователей -->
    <UserTable
      :users="users"
      :current-user-id="currentUserId"
      @create-user="showCreateForm"
      @edit-user="editUser"
      @delete-user="confirmDeleteUser"
    />

    <!-- Модальное окно подтверждения удаления -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>Подтверждение удаления</h3>
        </div>
        <div class="modal-body">
          <p>Вы уверены, что хотите удалить пользователя <strong>{{ userToDelete?.fullName }}</strong>?</p>
          <p class="warning-text">Это действие нельзя отменить.</p>
        </div>
        <div class="modal-actions">
          <button @click="showDeleteModal = false" class="btn-cancel">
            Отмена
          </button>
          <button @click="deleteUser" class="btn-delete" :disabled="loading">
            {{ loading ? 'Удаление...' : 'Удалить' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Уведомления -->
    <div v-if="message" class="alert alert-success">
      {{ message }}
    </div>

    <div v-if="error" class="alert alert-error">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { userService } from '@/services/userService';
import UserTable from '@/components/UserTable.vue';

export default {
  name: 'UsersView',
  components: {
    UserTable
  },
  data() {
    return {
      users: [],
      currentUserId: 0,
      showDeleteModal: false,
      userToDelete: null,
      loading: false,
      error: '',
      message: ''
    };
  },
  async mounted() {
    await this.loadUsers();
    this.getCurrentUserId();
  },
  methods: {
    async loadUsers() {
      try {
        this.loading = true;
        const response = await userService.getUsers();
        this.users = response.users;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    getCurrentUserId() {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          this.currentUserId = user.id;
        } catch (error) {
          console.error('Error parsing current user:', error);
        }
      }
    },

    showCreateForm() {
      this.$router.push('/admin/users/create');
    },

    editUser(user) {
      console.log('Editing user:', user.id);
      this.$router.push(`/admin/users/${user.id}`);
    },

    confirmDeleteUser(user) {
      this.userToDelete = user;
      this.showDeleteModal = true;
    },

    async deleteUser() {
      if (!this.userToDelete) return;

      try {
        this.loading = true;
        await userService.deleteUser(this.userToDelete.id);
        
        this.message = 'Пользователь успешно удален';
        this.showDeleteModal = false;
        this.userToDelete = null;
        
        // Обновляем список пользователей
        await this.loadUsers();
        
        // Скрываем сообщение через 3 секунды
        setTimeout(() => {
          this.message = '';
        }, 3000);
        
      } catch (error) {
        this.error = error.message;
        this.showDeleteModal = false;
        
        setTimeout(() => {
          this.error = '';
        }, 3000);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.users-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.view-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.btn-back {
  background: #4a5568;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s ease;
  text-decoration: none;
  display: inline-block;
}

.btn-back:hover {
  background: #2d3748;
}

.view-header h1 {
  color: white;
  margin: 0;
  font-size: 28px;
}

/* Модальное окно */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 100%;
  overflow: hidden;
}

.modal-header {
  padding: 20px 25px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  color: #2d3748;
  margin: 0;
  font-size: 18px;
}

.modal-body {
  padding: 25px;
}

.modal-body p {
  margin: 0 0 10px 0;
  color: #4a5568;
}

.warning-text {
  color: #e53e3e;
  font-weight: 600;
}

.modal-actions {
  padding: 20px 25px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 15px;
  justify-content: flex-end;
}

.btn-cancel {
  background: #a0aec0;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s ease;
}

.btn-cancel:hover {
  background: #718096;
}

.btn-delete {
  background: #e53e3e;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s ease;
}

.btn-delete:hover:not(:disabled) {
  background: #c53030;
}

.btn-delete:disabled {
  background: #a0aec0;
  cursor: not-allowed;
}

/* Уведомления */
.alert {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  z-index: 1001;
  max-width: 400px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.alert-success {
  background: #c6f6d5;
  color: #276749;
  border: 1px solid #9ae6b4;
}

.alert-error {
  background: #fed7d7;
  color: #c53030;
  border: 1px solid #feb2b2;
}

@media (max-width: 768px) {
  .view-header {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }

  .view-header h1 {
    text-align: center;
  }

  .modal {
    margin: 20px;
  }

  .modal-actions {
    flex-direction: column;
  }

  .alert {
    left: 20px;
    right: 20px;
    max-width: none;
  }
}
</style>