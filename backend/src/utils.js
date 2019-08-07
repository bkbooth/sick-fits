function checkPermissions(user, permissionsNeeded) {
  const matchedPermissions = user.permissions.filter(userPermission =>
    permissionsNeeded.includes(userPermission)
  );
  if (!matchedPermissions.length) {
    throw new Error(`
      You do not have sufficient permissions: ${permissionsNeeded.join(', ')}.
      You have permissions: ${user.permissions.join(', ')}
    `);
  }
}

module.exports = { checkPermissions };
