var minus = "-".charCodeAt(0);
var plus = "+".charCodeAt(0);
var dot = ".".charCodeAt(0);
var exp = "e".charCodeAt(0);
var EXP = "E".charCodeAt(0);

module.exports = function(value) {
  var pos = 0;
  var length = value.length;
  var dotted = false;
  var sciPos = -1;
  var containsNumber = false;
  var code;

  while (pos < length) {
    code = value.charCodeAt(pos);

    if (code >= 48 && code <= 57) {
      containsNumber = true;
    } else if (code === exp || code === EXP) {
      if (sciPos > -1 || pos === 0) {
        break;
      }
      sciPos = pos;

      var nextCode = value.charCodeAt(pos + 1);

      if (
        nextCode === plus ||
        nextCode === minus ||
        (nextCode >= 48 && nextCode <= 57)
      ) {
        if (nextCode === plus || nextCode === minus) {
          var nextNextCode = value.charCodeAt(pos + 2);

          if (nextNextCode < 48 || nextNextCode > 57) {
            break;
          }

          pos += 1;
        }

        pos += 1;
      } else {
        break;
      }
    } else if (code === dot) {
      if (dotted) {
        break;
      }
      dotted = true;
    } else if (code === plus || code === minus) {
      if (pos !== 0) {
        break;
      }
    } else {
      break;
    }

    pos += 1;
  }

  if (sciPos + 1 === pos) pos--;

  return containsNumber
    ? {
        number: value.slice(0, pos),
        unit: value.slice(pos)
      }
    : false;
};
