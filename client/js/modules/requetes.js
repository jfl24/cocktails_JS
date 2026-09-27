export const req_getListeCocktails = async () => {
  const reponse = await fetch("/cocktails");
  const objReponse = await reponse.json();
  return objReponse;
};
