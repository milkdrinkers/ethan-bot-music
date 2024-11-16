import Shard from 'model/shard';

// Instantiate and start shard automatically
const _shard = new Shard(); 
await _shard.start();

// Export shard instance for use in bot
export const shard = _shard;
export default shard;