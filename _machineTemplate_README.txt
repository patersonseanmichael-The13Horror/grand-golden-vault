Machine pages live in /games/slots/*.html
Machine configs live in /games/slots/machines/*.js

Each machine page loads:
  - VaultRouter/Auth/Engine
  - SlotCore + SlotAnimator
  - A single machine config (sets window.SLOT_MACHINE + window.spinSlot)

Slots Lobby (games/slots/slotsLobby.html) navigates to: ./<id>.html
