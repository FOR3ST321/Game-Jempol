let data = {
    thumbLeft: 8,
    turnposition: ["player", "com1", "com2", "com3"],
    turnIdx: 0,
    turn: "player",
    mode: "number", //number - thumb
    movedHand : [], //tangan yang digeser sama .animate()
    hideHand : [], //tangan yang harus di hide abis menang
    player: {
        pickedNumber: 0,
        pickedThumb: 0,
        status: "play",
        thumbNum: 2,
        thumbLeft: true,
        thumbRight: true,
    },
    com1: {
        pickedNumber: 0,
        pickedThumb: 0,
        status: "play",
        thumbNum: 2,
        thumbLeft: true,
        thumbRight: true,
    },
    com2: {
        pickedNumber: 0,
        pickedThumb: 0,
        status: "play",
        thumbNum: 2,
        thumbLeft: true,
        thumbRight: true,
    },
    com3: {
        pickedNumber: 0,
        pickedThumb: 0,
        status: "play",
        thumbNum: 2,
        thumbLeft: true,
        thumbRight: true,
    },
};