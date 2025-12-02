
// The length of the vector is square root of (x*x+y*y).
function vec2magnitude (vec2)
{
  return Math.sqrt((vec2.x * vec2.x + vec2.y * vec2.y));
}

function vec2divide (vec2, value)
{
  return { x: vec2.x / value, y: vec2.y / value };
}

function vec2multiply(vec2, value)
{
  return { x: vec2.x * value, y: vec2.y * value };
}

function vec2add (vec2,  value)
{
  return { x: vec2.x + value, y: vec2.y + value };
}

function vec2addvec2(a, b)
{
  return { x: a.x + b.x, y: a.y + b.y };
}

function vec2subtract (vec2,  value)
{
  return { x: vec2.x - value, y: vec2.y - value };
}

function vec2subtractvec2 (a, b)
{
  return { x: a.x - b.x, y: a.y - b.y };
}

function vec2normalise(a, b)
{
  var sum = Math.abs(a) + Math.abs(b);

  return { x: a / sum, y: b / sum };
}

function roundToTwoDecimalPlaces(a)
{
  a = a * 100;
  var round = Math.round(a);
  return round / 100;
}