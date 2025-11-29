// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const splitDecimals = (num:any) => {
  try {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  } catch (error) {
    console.log('error in splitDecimals: ',error)
    return error||"0";
  }
};
