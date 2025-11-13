<template>
  <div class="user-table">
    <div class="table-header">
      <h3>Список пользователей</h3>
      <button @click="$emit('create-user')" class="btn-primary">
        Добавить пользователя
      </button>
    </div>

    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>ФИО</th>
            <th>Email</th>
            <th>Роль</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.fullName }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span class="role-badge" :class="getRoleClass(user)">
                {{ getRoleName(user) }}
              </span>
            </td>
            <td>
              <span class="status-badge" :class="{ active: user.isActive }">
                {{ user.isActive ? 'Активен' : 'Неактивен' }}
              </span>
            </td>
            <td class="actions">
              <button 
                @click="$emit('edit-user', user)" 
                class="btn-edit"
                title="Редактировать"
              >
                Редактировать
              </button>
              <button 
                @click="$emit('delete-user', user)" 
                class="btn-delete"
                :disabled="user.id === currentUserId"
                :title="user.id === currentUserId ? 'Нельзя удалить себя' : 'Удалить'"
              >
                Удалить
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="users.length === 0" class="empty-state">
        <p>Пользователи не найдены</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserTable',
  props: {
    users: {
      type: Array,
      default: () => []
    },
    currentUserId: {
      type: Number,
      default: 0
    }
  },
  methods: {
    getRoleName(user) {
      // Безопасное получение названия роли
      const roleName = user.role?.name || this.getRoleNameById(user.roleId);
      const roles = {
        'manager': 'Менеджер',
        'engineer': 'Инженер',
        'observer': 'Наблюдатель'
      };
      return roles[roleName] || roleName || 'Неизвестно';
    },

    getRoleNameById(roleId) {
      const roles = {
        1: 'manager',
        2: 'engineer', 
        3: 'observer'
      };
      return roles[roleId] || 'unknown';
    },

    getRoleClass(user) {
      // Безопасное получение класса для роли
      const roleName = user.role?.name || this.getRoleNameById(user.roleId);
      return roleName || 'unknown';
    }
  }
};
</script>

<style scoped>
/* Стили остаются без изменений */
.user-table {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px;
  border-bottom: 1px solid #e2e8f0;
}

.table-header h3 {
  color: #2d3748;
  margin: 0;
  font-size: 20px;
}

.btn-primary {
  background: #4299e1;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s ease;
}

.btn-primary:hover {
  background: #3182ce;
}

.table-container {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th {
  background: #f7fafc;
  padding: 15px 20px;
  text-align: left;
  font-weight: 600;
  color: #4a5568;
  border-bottom: 1px solid #e2e8f0;
}

.table td {
  padding: 15px 20px;
  border-bottom: 1px solid #f1f5f9;
  color: #4a5568;
}

.table tbody tr:hover {
  background: #f7fafc;
}

.role-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.role-badge.manager {
  background: #bee3f8;
  color: #2c5282;
}

.role-badge.engineer {
  background: #c6f6d5;
  color: #276749;
}

.role-badge.observer {
  background: #faf089;
  color: #744210;
}

.role-badge.unknown {
  background: #e2e8f0;
  color: #4a5568;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.active {
  background: #c6f6d5;
  color: #276749;
}

.status-badge:not(.active) {
  background: #fed7d7;
  color: #c53030;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn-edit {
  background: #ecc94b;
  color: #744210;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: background 0.3s ease;
}

.btn-edit:hover {
  background: #d69e2e;
}

.btn-delete {
  background: #e53e3e;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: background 0.3s ease;
}

.btn-delete:hover:not(:disabled) {
  background: #c53030;
}

.btn-delete:disabled {
  background: #a0aec0;
  cursor: not-allowed;
  opacity: 0.6;
}

.empty-state {
  padding: 40px 20px;
  text-align: center;
  color: #718096;
}

.empty-state p {
  margin: 0;
}

@media (max-width: 768px) {
  .table-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .actions {
    flex-direction: column;
  }

  .btn-edit,
  .btn-delete {
    padding: 8px 12px;
    font-size: 11px;
  }
}
</style>