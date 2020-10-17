addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function getDoggos(numDoggos) {
  var arr = [];
  for (i = 0; i < numDoggos; i++) {
    const apiRes = await fetch('https://dog.ceo/api/breeds/image/random')
    const { message } = await apiRes.json();
    arr.push(message);
  }
  return arr;
}

function imgPerDog(urlString) {
  return `<img src="${urlString}" alt="random doggos width="320" height="240"">`
}

/**
 * Respond to the request
 * @param {Request} request
 */
async function handleRequest(request) {

  let numDoggos = parseInt(new URL(request.url).searchParams.get("quantity"));
  if (Number.isNaN(numDoggos) || numDoggos < 1 || numDoggos > 5) {
    numDoggos = 1;
  }
  const allDoggos = await getDoggos(numDoggos)

  const outputHtml = `
    <!DOCTYPE html>
    <html>
    <body>
        <form id="frm1">
            <label for="quantity">How Many Doggos Do U Want (1-5):</label>
            <input type="number" id="quantity" name="quantity" min="1" max="5" value="${numDoggos}">
            <input type="button" onclick="getNumDoggos()" value="Fetch!">
        </form>
        <script>
            function getNumDoggos() {
                document.getElementById("frm1").submit();
            }
        </script>
        ${allDoggos.map(dog => imgPerDog(dog)).join('\n')}
    </body>
    </html>
  `;

  return new Response(outputHtml, {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    },
  });
}