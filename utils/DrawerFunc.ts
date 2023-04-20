export const DrawerFunc = async(DrawerData: any, DrawerIcons: any, DrawerLinks: any) => {
  const data = [] as any;
  await DrawerData.map(async(item: any, index: number) => {
    data.push({
      title: item.title,
      subTitles: [],
      icon: DrawerIcons[item.title],
    })
    if(item.allowed){
      await item.allowed.map((subTitles: any) => {
        data[index].subTitles.push({
          title: subTitles.label,
          link: DrawerLinks[subTitles.label] ? DrawerLinks[subTitles.label] : ''
        })
      })
    }
  })
  console.log({DrawerFunc: data})
  return data;
};
