export const myLoader = ({ src, width, quality }: any) => {
    return `https://firebasestorage.googleapis.com/v0/b/test-2f271.appspot.com/o/${src}?alt=media&token=0c3472bd-50c6-4ee1-b08c-fe7469328339?w=${width}&q=${quality || 75}`
  }