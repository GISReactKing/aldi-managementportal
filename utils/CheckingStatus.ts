const checkingDisableOfAppButton = (
  currentUser: any,
  buttonTitle: string,
  titles: any
) => {
  if (
    !currentUser ||
    !titles ||
    !["create", "edit", "delete", "update"].includes(buttonTitle.toLowerCase())
  )
    return false;

  if (!currentUser.role || !currentUser.role.permissions) return false;

  const currentPageTitle = titles[titles.length - 1];

  let data = JSON.parse(JSON.stringify(currentUser.role.permissions));
  console.log("🚀 ~ file: CheckingStatus.ts:18 ~ data:", data);
  console.log("🚀 ~ file: CheckingStatus.ts:16 ~ titles:", titles);

  for (let i = 0; i < titles.length; i++) {
    data = JSON?.parse(JSON.stringify(data[titles[i]]));
    if (typeof data === "object") {
      if (titles[i] === currentPageTitle) {
        if (
          data["Create / Edit"] ||
          (data["Allow Create"] && data["Allow Update"] && data["Allow Delete"])
        ) {
          return false;
        }
      }
    }
  }

  return true;
};

export { checkingDisableOfAppButton };
