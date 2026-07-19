const SITE_HOST = 'ugne.online';
const INDEXNOW_KEY = '52c99c8c23d62861b4b1acf14ee1e9ba';
const URLS = [
  'https://ugne.online/',
  'https://ugne.online/statistics/',
  'https://ugne.online/sponsorship/',
  'https://ugne.online/say-cheese/',
  'https://ugne.online/llms.txt',
];

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: {'Content-Type': 'application/json; charset=utf-8'},
  body: JSON.stringify({
    host: SITE_HOST,
    key: INDEXNOW_KEY,
    keyLocation: `https://${SITE_HOST}/${INDEXNOW_KEY}.txt`,
    urlList: URLS,
  }),
});

if (!response.ok) {
  const body = await response.text();
  console.error(`IndexNow submission failed (${response.status}): ${body}`);
  process.exit(1);
}

console.log(`IndexNow submission accepted (${response.status}) for ${URLS.length} URLs.`);
