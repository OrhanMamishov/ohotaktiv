export const getUserData = async () =>
  await fetch(
    "https://ohotaktiv.ru/12dev/new-design/pages/header/hand_user.php?get_user_info=personal",
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((res) => {
      return res;
    });
