const dns = require('dns');

if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

function fixLocalhost(uri) {
  return uri.replace(/^mongodb:\/\/localhost(?=[:\/])/, 'mongodb://127.0.0.1');
}

function parseSrvUri(srvUri) {
  const match = srvUri.match(/^mongodb\+srv:\/\/([^@]+)@([^/?]+)(?:\/([^?]*))?(?:\?(.+))?$/);
  if (!match) throw new Error('Invalid mongodb+srv URI');
  return {
    credentials: match[1],
    host: match[2],
    database: match[3] || 'review-rating',
    query: match[4] || '',
  };
}

function buildStandardUri({ credentials, hosts, database, query }) {
  const params = new URLSearchParams(query);
  if (!params.has('ssl')) params.set('ssl', 'true');
  if (!params.has('authSource')) params.set('authSource', 'admin');
  if (!params.has('retryWrites')) params.set('retryWrites', 'true');
  if (!params.has('w')) params.set('w', 'majority');
  const qs = params.toString();
  return `mongodb://${credentials}@${hosts}/${database}?${qs}`;
}

async function resolveSrvWithFallback(host) {
  const name = `_mongodb._tcp.${host}`;

  try {
    return await dns.promises.resolveSrv(name);
  } catch (primaryErr) {
    const resolver = new dns.promises.Resolver();
    resolver.setServers(['8.8.8.8', '1.1.1.1']);
    try {
      return await resolver.resolveSrv(name);
    } catch {
      throw primaryErr;
    }
  }
}

async function srvToStandardUri(srvUri) {
  const { credentials, host, database, query } = parseSrvUri(srvUri);
  const records = await resolveSrvWithFallback(host);
  const hosts = records.map((r) => `${r.name}:${r.port}`).join(',');
  return buildStandardUri({ credentials, hosts, database, query });
}

async function getMongoUri() {
  if (process.env.MONGODB_URI_DIRECT) {
    return fixLocalhost(process.env.MONGODB_URI_DIRECT);
  }

  let uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/review-rating';
  uri = fixLocalhost(uri);

  if (!uri.startsWith('mongodb+srv://')) return uri;

  try {
    return await srvToStandardUri(uri);
  } catch (err) {
    console.warn(
      'MongoDB SRV lookup failed; use MONGODB_URI_DIRECT in .env if this persists.',
      err.message,
    );
    throw err;
  }
}

async function connectMongo(mongoose) {
  const uri = await getMongoUri();
  const safeLog = uri.replace(/:([^:@/]+)@/, ':****@');
  console.log('Connecting to MongoDB at', safeLog);
  await mongoose.connect(uri);
  return uri;
}

module.exports = { getMongoUri, connectMongo };
