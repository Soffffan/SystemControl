const Role = require('./Role');
const Status = require('./Status');
const Priority = require('./Priority');
const Stage = require('./Stage');
const User = require('./User');
const Project = require('./Project');
const Defect = require('./Defect');
const Comment = require('./Comment');
const Attachment = require('./Attachment');
const History = require('./History');
const Report = require('./Report');

//User ↔ Role
User.belongsTo(Role, { foreignKey: 'roleId' });
Role.hasMany(User, { foreignKey: 'roleId' });

//Project ↔ Status
Project.belongsTo(Status, { foreignKey: 'statusId' });
Status.hasMany(Project, { foreignKey: 'statusId' });

//Project ↔ User (customer)
Project.belongsTo(User, { foreignKey: 'customerId' });
User.hasMany(Project, { foreignKey: 'customerId' });

//Defect ↔ Project
Defect.belongsTo(Project, { foreignKey: 'projectId' });
Project.hasMany(Defect, { foreignKey: 'projectId' });

//Defect ↔ Stage
Defect.belongsTo(Stage, { foreignKey: 'stageId' });
Stage.hasMany(Defect, { foreignKey: 'stageId' });

//Defect ↔ Priority
Defect.belongsTo(Priority, { foreignKey: 'priorityId' });
Priority.hasMany(Defect, { foreignKey: 'priorityId' });

//Defect ↔ User (executor)
Defect.belongsTo(User, { foreignKey: 'executorId' });
User.hasMany(Defect, { foreignKey: 'executorId' });

//Comment ↔ User
Comment.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Comment, { foreignKey: 'userId' });

//Comment ↔ Defect
Comment.belongsTo(Defect, { foreignKey: 'defectId' });
Defect.hasMany(Comment, { foreignKey: 'defectId' });

//Attachment ↔ Defect
Attachment.belongsTo(Defect, { foreignKey: 'defectId' });
Defect.hasMany(Attachment, { foreignKey: 'defectId' });

//History ↔ User
History.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(History, { foreignKey: 'userId' });

//History ↔ Defect
History.belongsTo(Defect, { foreignKey: 'defectId' });
Defect.hasMany(History, { foreignKey: 'defectId' });

//Report ↔ User
Report.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Report, { foreignKey: 'userId' });

module.exports = {
  Role,
  Status,
  Priority,
  Stage,
  User,
  Project,
  Defect,
  Comment,
  Attachment,
  History,
  Report
};