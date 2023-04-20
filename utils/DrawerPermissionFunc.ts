export const DrawerPermissionFunc = async (
  DrawerData: any,
  MenuIcons: any,
  SubMenuIcons: any,
  DrawerLinks: any,
  clearRedux: any
) => {
  const data = [] as any;
  let DrawerData1 = undefined;
  let DrawerData2 = undefined;
  let index = data.length;
  let subIndex = 0;
  for (const key1 in DrawerData) {
    DrawerData1 = DrawerData[key1];
    if (DrawerLinks[key1]) {
      data[index] = {
        title: key1,
        icon: MenuIcons[key1],
        link: DrawerLinks[key1] ? DrawerLinks[key1] : "",
        ...(clearRedux?.[key1] ? { clearRedux: clearRedux?.[key1] } : {}),
      };
    } else {
      data[index] = {
        title: key1,
        icon: MenuIcons[key1],
        subTitles: [],
        ...(clearRedux?.[key1] ? { clearRedux: clearRedux?.[key1] } : {}),
      };
    }
    subIndex = 0;
    for (const key2 in DrawerData1) {
      DrawerData2 = DrawerData1[key2];
      if (data[index].subTitles) {
        if (SubMenuIcons[key2]) {
          data[index].subTitles = [
            ...data[index].subTitles,
            {
              title: key2,
              icon: SubMenuIcons[key2],
              subTitles: [],
              ...(clearRedux?.[key2] ? { clearRedux: clearRedux?.[key2] } : {}),
            },
          ];
        } else {
          data[index].subTitles = [
            ...data[index].subTitles,
            {
              title: key2,
              link: DrawerLinks[key2] ? DrawerLinks[key2] : "",
              ...(clearRedux?.[key2] ? { clearRedux: clearRedux?.[key2] } : {}),
            },
          ];
        }
      }
      for (const title in DrawerData2) {
        if (typeof DrawerData2[title] !== "boolean") {
          if (data[index].subTitles[subIndex]) {
            data[index].subTitles[subIndex].subTitles = [
              ...(data[index].subTitles[subIndex].subTitles || []),
              {
                title,
                link: DrawerLinks[title] ? DrawerLinks[title] : "",
                ...(clearRedux?.[title]
                  ? { clearRedux: clearRedux?.[title] }
                  : {}),
              },
            ];
          }
        }
      }
      subIndex++;
    }
    index++;
  }
  return data;
};
