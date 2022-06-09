import { showModal } from "./modal";

export function showWinnerModal(fighter) {
  const infoForWinner = {
    title: 'YOU WIN! ',
    bodyElement: fighter.name
  }
  showModal (infoForWinner);
}

