export function genGradient(word: string) {
  const colorPairs = [
    ["#ff9966", "#ff5e62"],
    ["#ff930f", "#fff95b"],
    ["#43c6ac", "#f8ffae"],
    ["#00c9ff", "#92fe9d"],
    ["#9796f0", "#fbc7d4"],
    ["#ffafbd", "#ffc3a0"],
  ];
  const modes = [
    "to-t",
    "to-tr",
    "to-r",
    "to-br",
    "to-b",
    "to-bl",
    "to-l",
    "to-tl",
  ];
  const hash1 = hash(word, 7331, 3823);
  const hash2 = hash(word, 4349, 5351);

  const colorPair = colorPairs[hash1 % colorPairs.length];
  const mode = modes[hash2 % modes.length];

  return `linear(${mode}, ${colorPair[0]}, ${colorPair[1]})`;
}
function hash(word: string, A: number, B: number) {
  var ret = 0;
  for (var i = 0; i < word.length; i++)
    ret = (ret * A + word.charCodeAt(i)) % B;
  return ret;
}
