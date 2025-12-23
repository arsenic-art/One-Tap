import avatar1 from "../assets/avatars/avatar1.jpg";
import avatar2 from "../assets/avatars/avatar2.jpg";
import avatar3 from "../assets/avatars/avatar3.jpg";
import avatar4 from "../assets/avatars/avatar4.jpg";
import avatar5 from "../assets/avatars/avatar5.jpg";
import avatar6 from "../assets/avatars/avatar6.jpg";
import avatar7 from "../assets/avatars/avatar7.jpg";
import avatar8 from "../assets/avatars/avatar8.jpg";
import avatar9 from "../assets/avatars/avatar9.jpg";
import avatar10 from "../assets/avatars/avatar10.jpg";

const avatars = [
  avatar1, avatar2, avatar3, avatar4, avatar5,
  avatar6, avatar7, avatar8, avatar9, avatar10,
];

export const getRandomAvatar = (seed) => {
  if (!seed) return avatars[0];
  const index = seed.charCodeAt(0) % avatars.length;
  return avatars[index];
};
