const chalk = require("chalk");
const turquoise = "#09d9d6";
const pink = "#FF2F64";
const navy = "#FFFFFF";
const white = "#FFFFFF";
const black = "#000000";

// const ab =
//   chalk.hex("#09D9D6")(`

// █████╗     ██╗██████╗
// ██╔══██╗   ██╔╝██╔══██╗
// ███████║  ██╔╝ ██████╔╝`) +
//   chalk.hex("#FF2F64")(`
// ██╔══██║ ██╔╝  ██╔══██╗
// ██║  ██║██╔╝   ██████╔╝
// ╚═╝  ╚═╝╚═╝    ╚═════╝

// `);
const logo =
  "\n".repeat(3) +
  chalk.hex(black)("       ") +
  chalk.hex(turquoise)(`WWNNXXNNW`) +
  " ".repeat(64) +
  "\n" +
  " ".repeat(4) +
  chalk.hex(turquoise)(`WNKOkkkkkkkk0N`) +
  " ".repeat(62) +
  "\n" +
  " ".repeat(2) +
  chalk.hex(turquoise)(`WN0k`) +
  chalk.hex(black)(" ".repeat(12)) +
  " ".repeat(73) +
  "\n" +
  " " +
  chalk.hex(turquoise)(`WXk`) +
  chalk.hex(black)(" ".repeat(5)) +
  chalk.hex(turquoise)(`0OOOO0X`) +
  " ".repeat(66) +
  "\n" +
  chalk.hex(turquoise)(`WXk`) +
  chalk.hex(black)(" ".repeat(4)) +
  chalk.hex(turquoise)(`OkO0KK0kxON`) +
  chalk.hex(black)(" ".repeat(32)) +
  chalk.hex(navy)(`NXXWM`) +
  chalk.hex(black)(" ".repeat(9)) +
  chalk.hex(navy)(`WXXW`) +
  chalk.hex(black)(" ".repeat(14)) +
  "\n" +
  chalk.hex(turquoise)(`W0x`) +
  chalk.hex(black)(" ".repeat(3)) +
  chalk.hex(turquoise)(`OxON`) +
  chalk.hex(black)(" ".repeat(5)) +
  chalk.hex(turquoise)(`kd0`) +
  chalk.hex(pink)(`   WNXXNW`) +
  chalk.hex(black)(" ".repeat(22)) +
  chalk.hex(navy)(`Wx;c0`) +
  chalk.hex(black)(" ".repeat(9)) +
  chalk.hex(navy)(`Wk;:O`) +
  chalk.hex(black)(" ".repeat(14)) +
  "\n" +
  chalk.hex(turquoise)(`W0x`) +
  chalk.hex(black)(" ".repeat(3)) +
  chalk.hex(turquoise)(`Ox0`) +
  chalk.hex(black)(" ".repeat(5)) +
  chalk.hex(turquoise)(`WOoO`) +
  chalk.hex(black)(" ".repeat(2)) +
  chalk.hex(pink)(`Xkddddx0NW`) +
  chalk.hex(black)(" ".repeat(19)) +
  chalk.hex(navy)(`Wd.;O`) +
  chalk.hex(black)(" ".repeat(9)) +
  chalk.hex(navy)(`Wx',k`) +
  chalk.hex(black)(" ".repeat(14)) +
  "\n" +
  chalk.hex(turquoise)(`WXk`) +
  chalk.hex(black)(" ".repeat(4)) +
  chalk.hex(turquoise)(`kxO`) +
  chalk.hex(black)(" ".repeat(5)) +
  chalk.hex(turquoise)(`OoO`) +
  chalk.hex(black)(" ") +
  chalk.hex(pink)(`WOox`) +
  chalk.hex(black)(" ".repeat(4)) +
  chalk.hex(pink)(`ooON`) +
  chalk.hex(black)(" ".repeat(4)) +
  chalk.hex(navy)(`W0xdoooodkXW  Wd.'ldoodkKW  Wx',k   XOdoodx0W \n`) +
  chalk.hex(turquoise)(` WKx`) +
  chalk.hex(black)(" ".repeat(4)) +
  chalk.hex(turquoise)(`0kxk`) +
  chalk.hex(black)(" ".repeat(3)) +
  chalk.hex(turquoise)(`OoO`) +
  chalk.hex(black)(" ".repeat(2)) +
  chalk.hex(pink)(`Xxod`) +
  chalk.hex(black)(" ".repeat(5)) +
  chalk.hex(pink)(`lkN`) +
  chalk.hex(navy)(`   Nkoodddo;.cK  Wd..:lol;.;O  Wx',k W0:':odl,,dN\n`) +
  chalk.hex(turquoise)(`  WXO`) +
  chalk.hex(black)(" ".repeat(4)) +
  chalk.hex(turquoise)(`Kkd`) +
  chalk.hex(black)(" ".repeat(3)) +
  chalk.hex(pink)(`OokW`) +
  chalk.hex(pink)(`  NKk`) +
  chalk.hex(black)(" ".repeat(6)) +
  chalk.hex(pink)(`lOW`) +
  chalk.hex(black)(" ".repeat(3)) +
  chalk.hex(navy)(`WNXKKK0l.,O  Wd.;O  WO;.l  Wx',O Xl.:0NNXo.,O\n`) +
  "   " +
  chalk.hex(turquoise)(`WNKOkxxx`) +
  chalk.hex(black)(" ".repeat(4)) +
  chalk.hex(pink)(`OokN`) +
  chalk.hex(black)(" ".repeat(4)) +
  chalk.hex(pink)(`NOl`) +
  chalk.hex(black)(" ".repeat(4)) +
  chalk.hex(pink)(`ckN`) +
  "  " +
  chalk.hex(navy)(`Xdc:clll;.,O  Wd.;O   K:.c  Wx',O K:.,:ccc;';O\n`) +
  "      " +
  chalk.hex(turquoise)(`WWNN`) +
  chalk.hex(black)(" ".repeat(4)) +
  chalk.hex(pink)(`W0ox`) +
  chalk.hex(black)(" ".repeat(4)) +
  chalk.hex(pink)(`WXk`) +
  chalk.hex(black)(" ".repeat(5)) +
  chalk.hex(pink)(`lkN`) +
  chalk.hex(black)(` `) +
  chalk.hex(navy)(`Wx''dXNNNd',O  Wd.;O  WO;.l  Wx',O Kc.;k0KKKKKN \n`) +
  chalk.hex(black)(" ".repeat(15)) +
  chalk.hex(pink)(`NOddkOOkdl`) +
  chalk.hex(black)(" ".repeat(4)) +
  chalk.hex(pink)(`ooKW`) +
  " " +
  chalk.hex(navy)(`Wk,'cxxxd:.'o  Wd.'cddo;.;O  Wx',k Wk,'cdxxxdON \n`) +
  chalk.hex(black)(" ".repeat(16)) +
  chalk.hex(pink)(`WX0kxxx`) +
  chalk.hex(black)(" ".repeat(5)) +
  chalk.hex(pink)(`oo0W`) +
  chalk.hex(navy)(`   NOolllldxdoo  W0olllllokKW  W0ddK  W0dllllloON \n`) +
  chalk.hex(black)(" ".repeat(14)) +
  chalk.hex(black)(" ".repeat(12)) +
  chalk.hex(pink)(`ookXW`) +
  chalk.hex(black)(" ".repeat(7)) +
  chalk.hex(navy)(`WWWW`) +
  chalk.hex(black)(" ".repeat(11)) +
  chalk.hex(navy)(`WW`) +
  chalk.hex(black)(" ".repeat(18)) +
  chalk.hex(navy)(`WWW`) +
  chalk.hex(black)(" ".repeat(5)) +
  "\n" +
  chalk.hex(black)(" ".repeat(14)) +
  chalk.hex(pink)(`WKOxdddddddk0XW`) +
  chalk.hex(black)(" ".repeat(52)) +
  "\n" +
  chalk.hex(black)(" ".repeat(17)) +
  chalk.hex(pink)(`WNNXXXNWW`) +
  chalk.hex(black)(" ".repeat(53)) +
  "\n".repeat(3);

function setupMessage() {
  console.log(logo);
  console.log(
    chalk.bold("Configuring ") +
      chalk.hex(turquoise).bold("A") +
      chalk.hex(pink).bold("B") +
      chalk.bold("le A/B test!")
  );
}

module.exports = setupMessage;
