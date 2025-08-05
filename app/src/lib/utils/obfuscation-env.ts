// Obfuscation Map Environment Variables
// This file contains the mapping between original and obfuscated image filenames
// as environment variables that can be accessed throughout the application

export const OBFUSCATION_MAP_ENV = {
	// Token 0
	OBFUSCATION_MAP_0_ORIGINAL: '0.png',
	OBFUSCATION_MAP_0_OBFUSCATED: '5b377cf6c45ad24030d367503854fc6b2ed621ee53ad1bcb36b4c5907f5efd52.png',
	OBFUSCATION_MAP_0_HASH: '5b377cf6c45ad24030d367503854fc6b2ed621ee53ad1bcb36b4c5907f5efd52',
	OBFUSCATION_MAP_0_SIZE: 2542622,

	// Token 1
	OBFUSCATION_MAP_1_ORIGINAL: '1.png',
	OBFUSCATION_MAP_1_OBFUSCATED: '82f41328c4c084676aa2a51348b366f9689bd6364f145613a2da8699a03adccb.png',
	OBFUSCATION_MAP_1_HASH: '82f41328c4c084676aa2a51348b366f9689bd6364f145613a2da8699a03adccb',
	OBFUSCATION_MAP_1_SIZE: 2606858,

	// Token 2
	OBFUSCATION_MAP_2_ORIGINAL: '2.png',
	OBFUSCATION_MAP_2_OBFUSCATED: 'e1e4a094b12d545f97e697e0f1139336872192c7aa61d11aed6248d13d840211.png',
	OBFUSCATION_MAP_2_HASH: 'e1e4a094b12d545f97e697e0f1139336872192c7aa61d11aed6248d13d840211',
	OBFUSCATION_MAP_2_SIZE: 2495585,

	// Token 3
	OBFUSCATION_MAP_3_ORIGINAL: '3.png',
	OBFUSCATION_MAP_3_OBFUSCATED: '8b611f37584d2f2e429c1532c72675805a048e92b616662fa9281679ffc7dbed.png',
	OBFUSCATION_MAP_3_HASH: '8b611f37584d2f2e429c1532c72675805a048e92b616662fa9281679ffc7dbed',
	OBFUSCATION_MAP_3_SIZE: 2621113,

	// Token 4
	OBFUSCATION_MAP_4_ORIGINAL: '4.png',
	OBFUSCATION_MAP_4_OBFUSCATED: '1756b7f080d7aef7de978588a9a98d161acd9d4b0ae2c44129e5988724d20757.png',
	OBFUSCATION_MAP_4_HASH: '1756b7f080d7aef7de978588a9a98d161acd9d4b0ae2c44129e5988724d20757',
	OBFUSCATION_MAP_4_SIZE: 2539707,

	// Token 5
	OBFUSCATION_MAP_5_ORIGINAL: '5.png',
	OBFUSCATION_MAP_5_OBFUSCATED: '2afad054892d6d81786c32b1d3cc7fd3e7c8dbe700457e439245507665b18b59.png',
	OBFUSCATION_MAP_5_HASH: '2afad054892d6d81786c32b1d3cc7fd3e7c8dbe700457e439245507665b18b59',
	OBFUSCATION_MAP_5_SIZE: 2360067,

	// Token 6
	OBFUSCATION_MAP_6_ORIGINAL: '6.png',
	OBFUSCATION_MAP_6_OBFUSCATED: '85daa120a1aaadd2a5e183a56633be5699294b07f5dea58aaff000bb4b860f29.png',
	OBFUSCATION_MAP_6_HASH: '85daa120a1aaadd2a5e183a56633be5699294b07f5dea58aaff000bb4b860f29',
	OBFUSCATION_MAP_6_SIZE: 2343445,

	// Token 7
	OBFUSCATION_MAP_7_ORIGINAL: '7.png',
	OBFUSCATION_MAP_7_OBFUSCATED: '8dd686077727e9bded985c7812e1c52a0a8121efe7e1ab6b8ea482b2378d93d8.png',
	OBFUSCATION_MAP_7_HASH: '8dd686077727e9bded985c7812e1c52a0a8121efe7e1ab6b8ea482b2378d93d8',
	OBFUSCATION_MAP_7_SIZE: 2450311,

	// Token 8
	OBFUSCATION_MAP_8_ORIGINAL: '8.png',
	OBFUSCATION_MAP_8_OBFUSCATED: 'ae6318554d5086c6212d85b4bfc5948af889948dd0ad2a248848cec53bcd4f6e.png',
	OBFUSCATION_MAP_8_HASH: 'ae6318554d5086c6212d85b4bfc5948af889948dd0ad2a248848cec53bcd4f6e',
	OBFUSCATION_MAP_8_SIZE: 2164402,

	// Token 9
	OBFUSCATION_MAP_9_ORIGINAL: '9.png',
	OBFUSCATION_MAP_9_OBFUSCATED: '65788d0d9470d21d50e2784ffc6bdcbe064bed8f48e54d0732fbf6cf6c563d6e.png',
	OBFUSCATION_MAP_9_HASH: '65788d0d9470d21d50e2784ffc6bdcbe064bed8f48e54d0732fbf6cf6c563d6e',
	OBFUSCATION_MAP_9_SIZE: 2196896,

	// Token 10
	OBFUSCATION_MAP_10_ORIGINAL: '10.png',
	OBFUSCATION_MAP_10_OBFUSCATED: 'a957cb652aa71bb4dcb61fb3287eb1a8027203d53b24e93d96ccb0ebd6c2d65d.png',
	OBFUSCATION_MAP_10_HASH: 'a957cb652aa71bb4dcb61fb3287eb1a8027203d53b24e93d96ccb0ebd6c2d65d',
	OBFUSCATION_MAP_10_SIZE: 2442695,

	// Note: This is a sample of the first 10 tokens. The full mapping contains 999 tokens.
	// For production, you would need to include all tokens from 0 to 998.
	// The complete mapping can be generated from the original obfuscation_map.json file.
} as const;

// Helper function to get obfuscation data for a specific token
export function getObfuscationData(tokenId: number) {
	const original = OBFUSCATION_MAP_ENV[`OBFUSCATION_MAP_${tokenId}_ORIGINAL` as keyof typeof OBFUSCATION_MAP_ENV];
	const obfuscated = OBFUSCATION_MAP_ENV[`OBFUSCATION_MAP_${tokenId}_OBFUSCATED` as keyof typeof OBFUSCATION_MAP_ENV];
	const hash = OBFUSCATION_MAP_ENV[`OBFUSCATION_MAP_${tokenId}_HASH` as keyof typeof OBFUSCATION_MAP_ENV];
	const size = OBFUSCATION_MAP_ENV[`OBFUSCATION_MAP_${tokenId}_SIZE` as keyof typeof OBFUSCATION_MAP_ENV];

	if (!original || !obfuscated || !hash || !size) {
		return null;
	}

	return {
		original,
		obfuscated,
		hash,
		size: Number(size)
	};
}

// Helper function to get all available token IDs
export function getAvailableTokenIds(): number[] {
	const tokenIds: number[] = [];
	for (let i = 0; i < 999; i++) {
		const original = OBFUSCATION_MAP_ENV[`OBFUSCATION_MAP_${i}_ORIGINAL` as keyof typeof OBFUSCATION_MAP_ENV];
		if (original) {
			tokenIds.push(i);
		}
	}
	return tokenIds;
}

// Updated obfuscation utility functions that use environment variables
export function getObfuscatedHash(tokenId: number): string | null {
	const data = getObfuscationData(tokenId);
	return data?.hash || null;
}

export function getImageUrl(tokenId: number, isRevealed: boolean = false): string {
	const hash = getObfuscatedHash(tokenId);
	console.log(`getImageUrl called with tokenId: ${tokenId}, isRevealed: ${isRevealed}, hash: ${hash}`);

	if (!hash) {
		// Fallback to original naming if obfuscation map isn't available
		const fallbackUrl = `https://techshaman.42024769.xyz/schizodio/images/revealed/${tokenId}.png`;
		console.log(`No hash found, using fallback URL: ${fallbackUrl}`);
		return fallbackUrl;
	}

	if (isRevealed) {
		// Return revealed version
		const revealedUrl = `https://techshaman.42024769.xyz/schizodio/images/revealed/${hash}.png`;
		console.log(`Returning revealed URL: ${revealedUrl}`);
		return revealedUrl;
	} else {
		// Return pixelated version
		const pixelatedUrl = `https://techshaman.42024769.xyz/schizodio/images/unrevealed/${hash}.png`;
		console.log(`Returning pixelated URL: ${pixelatedUrl}`);
		return pixelatedUrl;
	}
}

export function getMetadataUrl(tokenId: number, isRevealed: boolean = false): string {
	const hash = getObfuscatedHash(tokenId);
	if (!hash) {
		// Fallback to original naming if obfuscation map isn't available
		return `https://techshaman.42024769.xyz/schizodio/images/revealed/${tokenId}.json`;
	}

	if (isRevealed) {
		// Return revealed metadata
		return `https://techshaman.42024769.xyz/schizodio/images/revealed/${hash}.json`;
	} else {
		// Return unrevealed metadata
		return `https://techshaman.42024769.xyz/schizodio/images/unrevealed/${hash}.json`;
	}
}

export function getAllHashes(): string[] {
	const hashes: string[] = [];
	for (let i = 0; i < 999; i++) {
		const hash = getObfuscatedHash(i);
		if (hash) {
			hashes.push(hash);
		}
	}
	return hashes;
} 