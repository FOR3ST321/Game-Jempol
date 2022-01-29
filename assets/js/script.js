function changeTurn() {
    data.turnIdx++;
    if (data.turnIdx >= data.turnposition.length) data.turnIdx = 0;
    data.turn = data.turnposition[data.turnIdx];
}

function printName(){
    return (data.turn === "player") ? "Kamu" : "Com " + data.turn.slice(-1);
}

function generateThumbNumber() {
    $("#pickNumber").children().html(""); //reset

    for (let i = 0; i <= data.player.thumbNum; i++) {
        $("#pickNumber")
            .children()
            .append(
                `<button class="btn pickBtn" style="margin-bottom: 5px;" value="${i}">${i}</button>`
            );
    }
}

function generateNumberPick() {
    $("#pickNumber").children().html(""); //reset
    for (let i = 0; i <= data.thumbLeft; i++) {
        $("#pickNumber")
            .children()
            .append(
                `<button class="btn pickBtn" style="margin-bottom: 5px;" value="${i}">${i}</button>`
            );
    }
}

function moveHand(handObj, handPicked) {
    $("#numberNotifText").text(handPicked);
    $("#pickedNumberNotif").show();

    handObj.forEach((e) => {
        let move, mode, css;
        if (e.name === "com1" || e.name === "com3") {
            //gesernya ke kanan
            move = {
                right: "10vw",
            };
            css = {
                right: "0px",
                left: "",
            };
            mode = "right";
        } else {
            move = {
                left: "10vw",
            };
            css = {
                right: "",
                left: "0px",
            };
            mode = "left";
        }

        if (e.obj.thumbNum !== 0) {
            // console.log(e);
            //kalau masih sisa, gerakin tangan
            if (e.val === 1) {
                //cek jempol kiri
                if (e.obj.thumbLeft) {
                    //majuin kiri doang
                    $(`.${e.name}.left`).css(css).animate(move);
                    data.movedHand.push({
                        selector: `.${e.name}.left`,
                        move: mode,
                    });
                } else {
                    //majuin kanan doang
                    $(`.${e.name}.right`).css(css).animate(move);
                    data.movedHand.push({
                        selector: `.${e.name}.right`,
                        move: mode,
                    });
                }
            } else if (e.val === 2) {
                //majuin dua duanya
                $(`.${e.name}.right`).css(css).animate(move);
                $(`.${e.name}.left`).css(css).animate(move);
                data.movedHand.push({
                    selector: `.${e.name}.left`,
                    move: mode,
                });
                data.movedHand.push({
                    selector: `.${e.name}.right`,
                    move: mode,
                });
            }
        }
    });
}

function win(player, name) {
    if (player.thumbNum === 2) {
        player.thumbRight = false;
        data.hideHand.push(`.${name}.right`);
    } else if (player.thumbNum === 1) {
        player.thumbLeft = false;
        player.status = "win";
        data.hideHand.push(`.${name}.left`);
    }
    player.thumbNum--;
}

function printResult(picked, pickedThumb, com1, com2, com3, txt){
    $("#notif-text").html(`
        <strong>Tebakan ${printName()} ${txt}!</strong><br> <br>
        <strong>Angka Dipilih: </strong> ${picked} <br>
        <strong>Tangan (Player): </strong> ${pickedThumb} <br>
        <strong>Tangan (Com 1): </strong> ${com1} <br>
        <strong>Tangan (Com 2): </strong> ${com2} <br>
        <strong>Tangan (Com 3): </strong> ${com3}
    `);
}

function getResult() {
    let com1 = 0,
        com2 = 0,
        com3 = 0;

    if (data.com1.status === "play") {
        com1 = Math.floor(Math.random() * (data.com1.thumbNum + 1));
    }

    if (data.com2.status === "play") {
        com2 = Math.floor(Math.random() * (data.com2.thumbNum + 1));
    }

    if (data.com3.status === "play") {
        com3 = Math.floor(Math.random() * (data.com3.thumbNum + 1));
    }

    let picked;
    if (data.turn === "player") {
        picked = data.player.pickedNumber;
    } else {
        picked = Math.floor(Math.random() * (data.thumbLeft + 1));
    }

    console.log(
        `${
            data.player.pickedThumb
        } - ${com1} - ${com2} - ${com3} == ${picked} ${
            com1 + com2 + com3 + data.player.pickedThumb
        }`
    );

    //majuin tangan
    moveHand(
        [
            {
                name: "player",
                val: data.player.pickedThumb,
                obj: data.player,
            },
            {
                name: "com1",
                val: com1,
                obj: data.com1,
            },
            {
                name: "com2",
                val: com2,
                obj: data.com2,
            },
            {
                name: "com3",
                val: com3,
                obj: data.com3,
            },
        ],
        picked
    );

    if (picked === com1 + com2 + com3 + data.player.pickedThumb) {
        data.thumbLeft--;

        printResult(picked, data.player.pickedThumb, com1, com2, com3, 'benar')

        // alert(data.turn + " win!");
        switch (data.turn) {
            case "player":
                win(data.player, "player");
                break;
            case "com1":
                win(data.com1, "com1");
                break;
            case "com2":
                win(data.com2, "com2");
                break;
            case "com3":
                win(data.com3, "com3");
                break;
        }
    } else {
        printResult(picked, data.player.pickedThumb, com1, com2, com3, 'salah')
    }

    setTimeout(function () {
        $("#pickedNumberNotif").hide();
        $("#notif").show();
    }, 1000);
}

$(document).ready(function () {
    //setting awal
    $('#game').hide();
    $('#splash').show();
    $('#startGame').css({'visibility': 'hidden'});
    setTimeout(()=>{
        $('#startGame').css({'visibility': 'visible'});
    }, 1000);
    $("#notif").hide();
    $("#pickedNumberNotif").hide();
    $("#gameOverNotif").hide();
    generateNumberPick();


    //milih nomor
    $("#pickNumber").on("click", "button.pickBtn", function () {
        let val = $(this).val();
        $(this).addClass("picked");
        $(".pickBtn:not(.picked)").attr("disabled", "disabled");
        $(".pickBtn:not(.picked)").animate({
            opacity: 0,
        });

        //abis kepilih
        setTimeout(function () {
            //alert('you picked ' + val)
            if (data.turn === "player" && data.mode === "number") {
                data.player.pickedNumber = parseInt(val);
                $("#instruction").text(
                    "Pilih Jumlah Ibu jari yang mau dimajuin"
                );
                generateThumbNumber();

                data.mode = "thumb";
                console.log(data);
            } else if (data.turn === "player" && data.mode === "thumb") {
                data.player.pickedThumb = parseInt(val);
                getResult();

                data.mode = "number";
                changeTurn();
                generateThumbNumber();
                console.log(data);
            } else if (data.turn !== "player") {
                data.player.pickedThumb = parseInt(val);
                getResult();
                changeTurn();
                if (data.turn === "player") {
                    $('#instruction').text("Mau pilih Angka Berapa?");

                    generateNumberPick();
                } else {
                    generateThumbNumber();
                }
                console.log(data);
            }

            setTimeout(function () {
                //cek menang kalah / reset tangan disini:
                if (data.player.thumbNum == 0) {
                    //game berakhir
                    $("#player-win").html($(this).text() + '<br>[MENANG]');
                    $("#gameOverText").text("Hore!! Kamu menang!");
                    $("#gameOverNotif").show();
                    $("#notif").hide();
                } else if (data.com1.thumbNum == 0) {
                    $(`#com1-win`).html($(this).text() + '<br>[MENANG]');

                    //remove yang menang dari giliran:
                    data.turnposition = data.turnposition.filter((e) => {
                        return e != "com1";
                    });
                } else if (data.com2.thumbNum == 0) {
                    $(`#com2-win`).html($(this).text() + '<br>[MENANG]');

                    //remove yang menang dari giliran:
                    data.turnposition = data.turnposition.filter((e) => {
                        return e != "com2";
                    });
                } else if (data.com3.thumbNum == 0) {
                    $(`#com3-win`).html($(this).text() + '<br>[MENANG]');

                    //remove yang menang dari giliran:
                    data.turnposition = data.turnposition.filter((e) => {
                        return e != "com3";
                    });
                }
                //kalau semua bot menang
                if (
                    data.com1.thumbNum === 0 &&
                    data.com2.thumbNum === 0 &&
                    data.com3.thumbNum === 0
                ) {
                    $("#gameOverText").text("Yah, Kamu kalah :(");
                    $("#gameOverNotif").show();
                    $("#notif").hide();
                }
            }, 1000);
        }, 1500);
    });

    $("#startGame").click(() => {
        const audio = new Audio("./assets/audio.mp3");
        audio.loop = true;
        audio.volume = 0.5;
        audio.play();
        $("#splash").hide();
        $("#game").show();
    });

    $("#closeNotif").click(function () {
        //mundurin semua tangan yang digeser
        console.log(data.movedHand);
        data.movedHand.forEach((e) => {
            let obj = e;
            // alert('geser');

            let move, css;
            if (obj.move === "right") {
                //kalau tadi gerak kanan, sekarang geser kiri
                move = {
                    left: "10vw",
                };

                css = {
                    right: "",
                    left: "0px",
                };
            } else {
                move = {
                    right: "10vw",
                };

                css = {
                    right: "0px",
                    left: "",
                };
            }

            $(obj.selector).css(css).animate({
                move,
            });
        });

        //hide tangan
        data.hideHand.forEach((e) => {
            $(e).css({opacity:0});
        });

        data.movedHand = []; //reset
        data.hideHand = [];

        $("#turnInfo").text("Sekarang Giliran " + printName() + "!");

        $("#notif").hide();
    });

    $("#restart").click(function () {
        location.reload();
    });
});
