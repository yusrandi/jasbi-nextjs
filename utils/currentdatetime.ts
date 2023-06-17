export default function CurrentDateTime(): string {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    var hh = String(today.getHours()).padStart(2, '0');
    var ss = String(today.getMinutes()).padStart(2, '0');


  let todays = `${yyyy}/${mm}/${dd} ${hh}:${ss}`;
  return todays
}