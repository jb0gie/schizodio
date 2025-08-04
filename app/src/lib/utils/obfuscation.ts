export interface ObfuscationEntry {
	original: string;
	obfuscated: string;
	hash: string;
	size: number;
}

export interface ObfuscationMap {
	[tokenId: string]: ObfuscationEntry;
}

let obfuscationMap: ObfuscationMap | null = null;

export async function loadObfuscationMap(): Promise<ObfuscationMap> {
	if (obfuscationMap) {
		return obfuscationMap;
	}

	try {
		// Load the obfuscation map from the public directory
		const response = await fetch('/obfuscation_map.json');
		if (!response.ok) {
			throw new Error(`Failed to load obfuscation map: ${response.statusText} (${response.status})`);
		}

		const data = await response.json();
		console.log('Obfuscation map loaded successfully:', Object.keys(data).length, 'entries');
		obfuscationMap = data;
		return obfuscationMap!;
	} catch (error) {
		console.error('Error loading obfuscation map:', error);
		// Return empty map instead of throwing to prevent app crash
		return {};
	}
}

export function getObfuscatedHash(tokenId: number): string | null {
	if (!obfuscationMap) {
		console.warn('Obfuscation map not loaded');
		return null;
	}

	const entry = obfuscationMap[tokenId.toString()];
	return entry?.hash || null;
}

export function getImageUrl(tokenId: number, isRevealed: boolean = false): string {
	const hash = getObfuscatedHash(tokenId);
	if (!hash) {
		// Fallback to original naming if obfuscation map isn't available
		return `https://ipfs.io/ipfs/QmSyokSEoMsxwoLzvXS4D7Wi7byCnCL5BSnyZJEEW4sNvP/${tokenId}.png`;
	}

	if (isRevealed) {
		// Return revealed version
		return `https://ipfs.io/ipfs/QmSyokSEoMsxwoLzvXS4D7Wi7byCnCL5BSnyZJEEW4sNvP/${hash}.png`;
	} else {
		// Return pixelated version
		return `https://ipfs.io/ipfs/QmTmerc9M5P7kDxXhvG8wLoeCxr9ivS57ysu6mT3A4buGH/${hash}.png`;
	}
}

export function getMetadataUrl(tokenId: number, isRevealed: boolean = false): string {
	const hash = getObfuscatedHash(tokenId);
	if (!hash) {
		// Fallback to original naming if obfuscation map isn't available
		return `https://techshaman.42024769.xyz/schizodio/json/revealed/${tokenId}.json`;
	}

	if (isRevealed) {
		// Return revealed metadata
		return `https://techshaman.42024769.xyz/schizodio/json/revealed/${hash}.json`;
	} else {
		// Return unrevealed metadata
		return `https://techshaman.42024769.xyz/schizodio/json/unrevealed/${hash}.json`;
	}
}

export function getAllHashes(): string[] {
	if (!obfuscationMap) {
		console.warn('Obfuscation map not loaded');
		return [];
	}

	return Object.keys(obfuscationMap)
		.sort((a, b) => parseInt(a) - parseInt(b))
		.map(key => obfuscationMap![key].hash);
}