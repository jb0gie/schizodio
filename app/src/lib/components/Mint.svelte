<script lang="ts">
  import Window from './Window.svelte';
  import Button from './Button.svelte';
  import ProgressBar from './ProgressBar.svelte';
  import { currentTheme } from '../stores/theme';
  import schizodio_title from '../../assets/images/schizodio.png';
  import { link } from 'svelte-spa-router';
  import { onMount, onDestroy } from 'svelte';
  import { connect, disconnect } from 'starknetkit';
  import { Contract, Account, RpcProvider } from 'starknet';
  import { InjectedConnector } from 'starknetkit/injected';
  import { WebWalletConnector } from 'starknetkit/webwallet';
  import { loadObfuscationMap, getImageUrl } from '../utils/obfuscation';
  import { COLLECTION_CONFIG, type TokenMetadata } from '../types/contract';

  let walletConnected = false;
  let account: Account | null = null;
  let walletAddress = '';
  let walletId = '';
  let walletName = '';
  let currentSupply = 0;
  let maxSupply = COLLECTION_CONFIG.MAX_SUPPLY;
  let mintPrice = 30; // $30 USD
  let isMinting = false;
  let mintStatus = '';
  let lastMintedId: number | null = null;
  let obfuscationMapLoaded = false;
  let isRevealed = false;

  // Payment tokens
  let selectedToken = 'ETH';
  let paymentTokens = [
    {
      symbol: 'ETH',
      address: COLLECTION_CONFIG.PAYMENT_TOKENS.ETH,
      price: '0.01',
      decimals: 18,
      icon: '⟠',
    },
    {
      symbol: 'USDC',
      address: COLLECTION_CONFIG.PAYMENT_TOKENS.USDC,
      price: '30',
      decimals: 6,
      icon: '💸',
    },
    {
      symbol: 'USDT',
      address: COLLECTION_CONFIG.PAYMENT_TOKENS.USDT,
      price: '30',
      decimals: 6,
      icon: '💵',
    },
    {
      symbol: 'DAI',
      address: COLLECTION_CONFIG.PAYMENT_TOKENS.DAI,
      price: '30',
      decimals: 18,
      icon: '🟡',
    },
    {
      symbol: 'WBTC',
      address: COLLECTION_CONFIG.PAYMENT_TOKENS.WBTC,
      price: '0.0003',
      decimals: 8,
      icon: '₿',
    },
    {
      symbol: 'STRK',
      address: COLLECTION_CONFIG.PAYMENT_TOKENS.STRK,
      price: '300',
      decimals: 18,
      icon: '⭐',
    },
  ];

  // Schizo elements
  let showFakePopup = false;
  let popupMessage = '';
  let blinkState = true;
  let mouseTrail: Array<{ x: number; y: number; id: number }> = [];
  let trailId = 0;
  let visitorCount = Math.floor(Math.random() * 999999) + 100000;
  let currentTime = new Date().toLocaleString();
  let schizoMessages = [
    "🚨 CONGRATULATIONS! YOU'VE WON A FREE NFT! (just kidding lol)",
    '⚠️ YOUR COMPUTER MAY BE INFECTED! Click OK to continue anyway',
    "💀 SECURITY ALERT: Someone is trying to hack your NFTs! (spoiler: it's me)",
    "🎰 LUCKY! You're visitor #" +
      visitorCount +
      "! You've won absolutely nothing!",
    '🛸 ALIENS ARE MONITORING THIS TRANSACTION! Wave at them! 👽',
    '🔥 HOT NFT DEALERS HATE THIS ONE TRICK!',
    '💊 YOU HAVE CHOSEN THE RED PILL! Welcome to the Matrix of NFTs',
    '🎮 ERROR 404: REALITY NOT FOUND! Please insert more tokens to continue.',
    '🌈 UNICORNS WANT TO STEAL YOUR PRIVATE KEYS! Trust no one, not even yourself!',
    '⚡ BREAKING: Local man discovers NFTs, immediately loses sanity!',
    '🍕 Your Pizza.exe has stopped working. Would you like to mint an NFT instead?',
    '🎪 STEP RIGHT UP! See the amazing blockchain circus! Witness smart contracts!',
    '🚀 NASA CONFIRMS: NFTs visible from space! Aliens are jealous!',
    '💰 BANKER HATES THIS: Local schizo makes millions with this one weird trick!',
    '🎭 SIMULATION CONFIRMED: You are in a computer. This NFT is your way out.',
    '🔥 WARNING: This NFT contains 99% pure digital chaos! Handle with care!',
  ];

  let intervals: any[] = [];

  const NFT_CONTRACT_ADDRESS = COLLECTION_CONFIG.CONTRACT_ADDRESS;

  // StarknetKit connectors - Updated with proper URLs from docs
  const connectors = [
    new InjectedConnector({
      options: { id: 'argentX', name: 'Argent X' },
    }),
    new InjectedConnector({
      options: { id: 'braavos', name: 'Braavos' },
    }),
    new WebWalletConnector({
      url: 'https://web.argent.xyz', // Argent Web Wallet
    }),
  ];

  $: ({
    colors: { background, window, text, highlight, highlightText },
  } = $currentTheme);

  $: progress = maxSupply > 0 ? (currentSupply / maxSupply) * 100 : 0;

  onMount(async () => {
    try {
      console.log('Loading obfuscation map...');
      await loadObfuscationMap();
      obfuscationMapLoaded = true;
      mintStatus = '🎉 READY TO ENTER THE SCHIZO ZONE! 🎉';
      console.log('Obfuscation map loaded successfully');
    } catch (error) {
      console.error('Failed to load obfuscation map:', error);
      mintStatus = '⚠️ CHAOS MODE: Using backup reality!';
    }
    await loadSupplyInfo();
    startSchizoMode();
  });

  onDestroy(() => {
    intervals.forEach(clearInterval);
  });

  function startSchizoMode() {
    // Blinking text animation
    intervals.push(
      setInterval(() => {
        blinkState = !blinkState;
      }, 500)
    );

    // Random popup messages
    intervals.push(
      setInterval(() => {
        if (Math.random() < 0.3) {
          // 30% chance every 5 seconds
          showRandomPopup();
        }
      }, 5000)
    );

    // Update visitor counter
    intervals.push(
      setInterval(() => {
        visitorCount += Math.floor(Math.random() * 10) + 1;
        currentTime = new Date().toLocaleString();
      }, 3000)
    );

    // Mouse trail effect
    document.addEventListener('mousemove', handleMouseMove);
  }

  function handleMouseMove(e: MouseEvent) {
    trailId++;
    mouseTrail = [
      ...mouseTrail,
      { x: e.clientX, y: e.clientY, id: trailId },
    ].slice(-10);

    setTimeout(() => {
      mouseTrail = mouseTrail.filter(point => point.id !== trailId);
    }, 1000);
  }

  function showRandomPopup() {
    popupMessage =
      schizoMessages[Math.floor(Math.random() * schizoMessages.length)];
    showFakePopup = true;
  }

  function closeFakePopup() {
    showFakePopup = false;
    // Sometimes spawn another popup just to be annoying
    if (Math.random() < 0.4) {
      setTimeout(() => {
        showRandomPopup();
      }, 2000);
    }
  }

  async function connectWallet() {
    try {
      mintStatus = '🔄 INITIATING SOUL LINK PROTOCOL...';

      const { wallet } = await connect({
        connectors,
        modalMode: 'alwaysAsk',
        modalTheme: 'dark',
        dappName: 'Schizodio NFT',
      });

      console.log('StarknetKit connect result:', wallet);

      if (wallet) {
        const walletAny = wallet as any;
        console.log('Wallet object structure:', {
          id: wallet.id,
          account: walletAny.account,
          provider: walletAny.provider,
          isConnected: walletAny.isConnected,
          selectedAddress: walletAny.selectedAddress,
        });

        // Try multiple ways to extract account and address (different wallet structures)
        let extractedAccount = null;
        let extractedAddress = '';

        console.log('🔍 Attempting to extract address from wallet:', {
          walletId: wallet.id,
          hasAccount: !!walletAny.account,
          hasSelectedAddress: !!walletAny.selectedAddress,
          hasAddress: !!walletAny.address,
          accountStructure: walletAny.account,
          isConnected: walletAny.isConnected,
          enable: typeof walletAny.enable === 'function',
        });

        // Method 1: Direct account property
        if (walletAny.account?.address) {
          extractedAccount = walletAny.account;
          extractedAddress = walletAny.account.address;
          console.log('✅ Method 1: Found address via account.address');
        }
        // Method 2: selectedAddress property (some wallets use this)
        else if (walletAny.selectedAddress) {
          extractedAddress = walletAny.selectedAddress;
          extractedAccount = { address: walletAny.selectedAddress };
          console.log('✅ Method 2: Found address via selectedAddress');
        }
        // Method 3: address property directly
        else if (walletAny.address) {
          extractedAddress = walletAny.address;
          extractedAccount = { address: walletAny.address };
          console.log('✅ Method 3: Found address via direct address property');
        }
        // Method 4: Try to enable/connect first (for wallets that need activation)
        else if (
          typeof walletAny.enable === 'function' &&
          !walletAny.isConnected
        ) {
          console.log('🔄 Wallet not fully connected, attempting to enable...');
          try {
            const enableResult = await walletAny.enable();
            console.log('Enable result:', enableResult);

            // Try again after enabling
            if (walletAny.account?.address) {
              extractedAccount = walletAny.account;
              extractedAddress = walletAny.account.address;
              console.log('✅ Method 4: Found address after enable');
            } else if (walletAny.selectedAddress) {
              extractedAddress = walletAny.selectedAddress;
              extractedAccount = { address: walletAny.selectedAddress };
              console.log('✅ Method 4: Found selectedAddress after enable');
            }
          } catch (enableError) {
            console.warn('Failed to enable wallet:', enableError);
          }
        }

        if (extractedAddress) {
          // Successfully extracted account and address
          account = extractedAccount;
          walletAddress = extractedAddress;
          walletId = wallet.id || '';
          walletName = getWalletName(wallet.id);
          walletConnected = true;
          mintStatus = `🎉 SOUL LINKED VIA ${walletName.toUpperCase()}! MATRIX ACCESS GRANTED! 🎉`;

          console.log('✅ Wallet successfully connected:', {
            id: wallet.id,
            name: walletName,
            address: walletAddress,
            account: extractedAccount,
            walletStructure: walletAny,
          });
        } else {
          console.warn(
            '❌ Wallet connected but no account/address found. Wallet structure:',
            {
              id: wallet.id,
              hasAccount: !!walletAny.account,
              hasSelectedAddress: !!walletAny.selectedAddress,
              hasAddress: !!walletAny.address,
              fullWallet: walletAny,
            }
          );
          mintStatus =
            '⚠️ WALLET LINKED BUT SOUL INCOMPLETE! No address found. Try reconnecting or check wallet unlock status.';
        }
      } else {
        console.warn('❌ No wallet returned from connect');
        mintStatus =
          '❌ NO WALLET DETECTED! Install Argent X, Braavos, or use Argent Web.';
      }
    } catch (error: any) {
      console.error('❌ Failed to connect wallet:', error);
      if (error?.message?.includes('User rejected')) {
        mintStatus = '👻 SOUL LINKING CANCELLED! User fled from the matrix.';
      } else if (error?.message?.includes('No wallet found')) {
        mintStatus =
          '💀 NO WALLETS DETECTED! Install Argent X or Braavos first.';
      } else {
        mintStatus = `💥 SOUL LINKING FAILED! Error: ${error?.message || 'Unknown error'}`;
      }
    }
  }

  async function disconnectWallet() {
    try {
      await disconnect();
      walletConnected = false;
      account = null;
      walletAddress = '';
      walletId = '';
      walletName = '';
      mintStatus = '👻 SOUL DISCONNECTED FROM THE MATRIX! Reality restored.';
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      mintStatus = '💥 DISCONNECTION FAILED! You are trapped in the matrix!';
    }
  }

  async function loadSupplyInfo() {
    try {
      // This would connect to your deployed contract to get current supply
      // For now, using placeholder values
      currentSupply = 42; // Replace with actual contract call
      maxSupply = 999;
      mintPrice = 0; // Free mint
      isRevealed = false; // Replace with actual contract call
    } catch (error) {
      console.error('Failed to load supply info:', error);
    }
  }

  async function mintNFT() {
    if (!account || !walletConnected) {
      mintStatus = '💀 CONNECT YOUR SOUL TO THE BLOCKCHAIN FIRST! 💀';
      return;
    }

    if (currentSupply >= maxSupply) {
      mintStatus = '🚨 ALL SCHIZO BROTHERS HAVE BEEN ADOPTED! 🚨';
      return;
    }

    const selectedPaymentToken = paymentTokens.find(
      token => token.symbol === selectedToken
    );
    if (!selectedPaymentToken) {
      mintStatus = '🤖 ERROR: PAYMENT METHOD FROM ANOTHER DIMENSION!';
      return;
    }

    try {
      isMinting = true;
      mintStatus = `🛸 INITIATING ${selectedToken} SACRIFICE RITUAL... 🛸`;

      // Create contract instance
      const provider = new RpcProvider({
        nodeUrl: 'https://starknet-mainnet.public.blastapi.io',
      });

      // You'll need to replace this with your actual contract ABI
      const contract = new Contract([], NFT_CONTRACT_ADDRESS, provider);
      contract.connect(account);

      mintStatus = `💸 TRANSFERRING ${selectedPaymentToken.price} ${selectedToken} TO THE VOID...`;

      // For paid minting, use mint_with_payment function
      const mintCall = contract.populate('mint_with_payment', [
        selectedPaymentToken.address,
      ]);

      mintStatus = '🎭 SUMMONING YOUR SCHIZO BROTHER FROM THE ABYSS...';

      const tx = await account.execute(mintCall);

      mintStatus = '⚡ TRANSACTION LAUNCHED INTO THE BLOCKCHAIN MATRIX! ⚡';

      // Wait for transaction to be accepted
      await provider.waitForTransaction(tx.transaction_hash);

      lastMintedId = currentSupply;
      currentSupply += 1;
      mintStatus = `🎉 SCHIZO BROTHER #${lastMintedId} HAS BEEN BORN! WELCOME TO THE FAMILY! 🎉`;

      // Random celebration popup
      setTimeout(() => {
        popupMessage = `🎊 BREAKING: ${walletAddress.slice(0, 6)}... just minted NFT #${lastMintedId} for ${selectedPaymentToken.price} ${selectedToken}! The blockchain is trembling! 🎊`;
        showFakePopup = true;
      }, 1000);
    } catch (error) {
      console.error('Minting failed:', error);
      mintStatus =
        '💥 THE SIMULATION GLITCHED! Try again or reality might collapse! 💥';
    } finally {
      isMinting = false;
    }
  }

  function formatAddress(address: string): string {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  function getWalletName(walletId: string): string {
    switch (walletId) {
      case 'argentX':
        return 'Argent X';
      case 'braavos':
        return 'Braavos';
      case 'argentWebWallet':
      case 'webWallet':
        return 'Argent Web';
      case 'argentMobile':
        return 'Argent Mobile';
      default:
        return walletId || 'Unknown';
    }
  }

  function getWalletEmoji(walletId: string): string {
    switch (walletId) {
      case 'argentX':
        return '🔵';
      case 'braavos':
        return '🦆';
      case 'argentWebWallet':
      case 'webWallet':
        return '🌐';
      case 'argentMobile':
        return '📱';
      default:
        return '👛';
    }
  }

  function getIPFSImageUrl(tokenId: number): string {
    return getImageUrl(tokenId, isRevealed);
  }
</script>

<!-- MATRIX RAIN BACKGROUND -->
<div class="matrix-rain"></div>

<!-- Mouse Trail -->
{#each mouseTrail as point (point.id)}
  <div
    class="mouse-trail spinning"
    style="left: {point.x - 5}px; top: {point.y - 5}px;"
  ></div>
{/each}

<!-- Visitor Counter -->
<div class="visitor-counter blink">
  👁️ Visitor #{visitorCount} 👁️
  <br />
  {currentTime}
</div>

<!-- Fake Popup -->
{#if showFakePopup}
  <div class="popup">
    <div class="flex flex-col gap-3">
      <div class="mega-text text-center">🚨 ALERT! 🚨</div>
      <div class="schizo-text text-center">{popupMessage}</div>
      <div class="flex gap-2 justify-center">
        <Button on:click={closeFakePopup}>OK</Button>
        <Button on:click={closeFakePopup}>Cancel</Button>
        <Button on:click={closeFakePopup}>Maybe</Button>
      </div>
    </div>
  </div>
{/if}

<!-- MAIN SCHIZO CONTENT -->
<div
  class="gap-4 flex flex-col justify-center items-center w-full min-h-screen overflow-x-hidden"
>
  <!-- TOP NAVIGATION -->
  <div class="w-full max-w-screen-xl mx-auto px-4">
    <Window title="🚀 DIMENSIONAL TRAVEL 🚀" width="full">
      <div class="flex gap-4 justify-center p-2">
        <a href="/" use:link>
          <Button>
            <span class="mega-text glitch shake intense-blink">
              🏠 ESCAPE TO HOME DIMENSION 🏠
            </span>
          </Button>
        </a>
      </div>
    </Window>
  </div>

  <!-- TITLE -->
  <div class="w-full max-w-screen-xl mx-auto px-4 flex justify-center">
    <img
      src={schizodio_title}
      alt="Schizodio"
      class="w-full h-auto rainbow"
      style="max-width: 500px;"
    />
  </div>

  <!-- SCHIZO ANNOUNCEMENT BAR -->
  <div class="w-full max-w-screen-xl mx-auto px-4">
    <Window title="📢 SCHIZO NEWS NETWORK 📢" width="full">
      <div
        class="p-2 sm:p-4 matrix text-center mega-text {blinkState
          ? 'blink'
          : ''} glitch-text"
      >
        🔥 EXCLUSIVE NFT DROP! SCHIZODIO BROTHERS ARE TAKING OVER THE
        BLOCKCHAIN! 🔥
      </div>
    </Window>
  </div>

  <!-- MAIN INTERFACE -->
  <div class="w-full max-w-screen-xl mx-auto px-4">
    <div class="flex flex-col xl:flex-row gap-4 justify-center">
      <!-- PAYMENT & MINT SECTION -->
      <div class="flex flex-col gap-4 flex-1 max-w-2xl">
        <!-- WALLET CONNECTION -->
        <Window title="💀 SOUL CONNECTION PORTAL 💀" width="full">
          <div class="p-4 flex flex-col gap-3">
            <h3 class="mega-text rainbow text-center">WALLET STATUS</h3>
            {#if walletConnected}
              <div class="matrix text-center p-3 shake">
                <div class="mega-text blink">
                  {getWalletEmoji(walletId)} SOUL LINKED {getWalletEmoji(
                    walletId
                  )}
                </div>
                <div class="schizo-text rainbow mt-2">
                  🔗 WALLET: {walletName}
                </div>
                <div class="schizo-text mt-1">
                  📍 ADDRESS: {formatAddress(walletAddress)}
                </div>
                {#if walletAddress}
                  <div class="text-xs mt-2 opacity-80">
                    Full Address: {walletAddress}
                  </div>
                {/if}
                <div class="mt-3 flex flex-col gap-2">
                  <Button on:click={disconnectWallet}>
                    💀 DISCONNECT FROM MATRIX 💀
                  </Button>
                  {#if walletId === 'webWallet' || walletId === 'argentWebWallet'}
                    <a
                      href="https://web.argent.xyz"
                      target="_blank"
                      rel="noopener"
                    >
                      <Button>🌐 OPEN WALLET DASHBOARD</Button>
                    </a>
                  {/if}
                </div>
              </div>
            {:else}
              <div class="text-center">
                <div class="mega-text blink intense-blink">
                  ⚠️ UNLINKED SOUL DETECTED ⚠️
                </div>
                <div class="schizo-text mt-2">
                  🔌 SUPPORTED WALLETS: Argent X, Braavos, Argent Web
                </div>
                <Button on:click={connectWallet}>
                  🔗 LINK YOUR SOUL TO THE BLOCKCHAIN 🔗
                </Button>
                <div class="text-xs mt-2 opacity-60">
                  💡 Make sure your wallet is installed and unlocked
                </div>
                {#if mintStatus}
                  <div class="mt-3 p-2 matrix text-xs">
                    🔍 DEBUG: {mintStatus}
                  </div>
                {/if}
              </div>
            {/if}
          </div>
        </Window>

        <!-- PAYMENT TOKEN SELECTOR -->
        <Window title="💰 SACRIFICE METHOD SELECTOR 💰" width="full">
          <div class="p-4">
            <h3 class="mega-text text-center rainbow mb-3">
              CHOOSE YOUR TRIBUTE
            </h3>
            <div class="token-selector">
              {#each paymentTokens as token}
                <div
                  class="token-option float chaotic-hover {selectedToken ===
                  token.symbol
                    ? 'selected'
                    : ''}"
                  on:click={() => (selectedToken = token.symbol)}
                  on:keydown={e =>
                    e.key === 'Enter' && (selectedToken = token.symbol)}
                  role="button"
                  tabindex="0"
                >
                  <div class="mega-text">{token.icon} {token.symbol}</div>
                  <div class="schizo-text">{token.price} {token.symbol}</div>
                  <div class="text-sm">~$30 USD</div>
                </div>
              {/each}
            </div>

            <div class="text-center mt-3 matrix p-2">
              <div class="mega-text">SELECTED: {selectedToken}</div>
              <div class="schizo-text">
                PRICE: {paymentTokens.find(t => t.symbol === selectedToken)
                  ?.price}
                {selectedToken}
              </div>
            </div>
          </div>
        </Window>

        <!-- MINT BUTTON -->
        <Window title="🎭 SUMMONING CHAMBER 🎭" width="full">
          <div class="p-4 text-center">
            <Button
              on:click={mintNFT}
              disabled={!walletConnected ||
                isMinting ||
                currentSupply >= maxSupply}
            >
              {#if isMinting}
                🌀 RITUAL IN PROGRESS... 🌀
              {:else if currentSupply >= maxSupply}
                💀 ALL BROTHERS ADOPTED 💀
              {:else}
                🎯 SUMMON SCHIZO BROTHER (${mintPrice})
              {/if}
            </Button>

            {#if mintStatus}
              <div class="mt-3 p-3 matrix shake">
                <div
                  class="schizo-text glitch-text {blinkState ? 'blink' : ''}"
                >
                  {mintStatus}
                </div>
              </div>
            {/if}
          </div>
        </Window>
      </div>

      <!-- PREVIEW & INFO SECTION -->
      <div class="flex flex-col gap-4 flex-1 max-w-2xl">
        <!-- NFT PREVIEW -->
        <Window title="🖼️ SCHIZO PORTAL PREVIEW 🖼️" width="full">
          <div class="p-4 pb-4">
            <div
              class="border-4 border-black mb-3 bg-gradient-to-r from-purple-500 to-pink-500"
            >
              <img
                src="placeholder.webp"
                alt="Schizo NFT Preview"
                class="w-full"
                loading="lazy"
              />
            </div>
            <div class="text-center">
              <div class="mega-text rainbow">
                NEXT BROTHER: #{currentSupply}
              </div>
              <div class="schizo-text">
                Status: {isRevealed ? '🎉 REVEALED! 🎉' : '🔒 MYSTERY MODE 🔒'}
              </div>
            </div>
          </div>
        </Window>

        <!-- COLLECTION STATS -->
        <Window title="📊 SCHIZO STATISTICS 📊" width="full">
          <div class="p-4">
            <h3 class="mega-text text-center rainbow mb-3">
              ADOPTION PROGRESS
            </h3>
            <ProgressBar value={progress} max={100} />

            <div class="grid grid-cols-2 gap-2 text-center">
              <div class="matrix p-2">
                <div class="mega-text">{currentSupply}</div>
                <div class="schizo-text">ADOPTED</div>
              </div>
              <div class="matrix p-2">
                <div class="mega-text">{maxSupply - currentSupply}</div>
                <div class="schizo-text">WAITING</div>
              </div>
              <div class="matrix p-2">
                <div class="mega-text">999</div>
                <div class="schizo-text">TOTAL</div>
              </div>
              <div class="matrix p-2">
                <div class="mega-text">STARKNET</div>
                <div class="schizo-text">BLOCKCHAIN</div>
              </div>
            </div>
          </div>
        </Window>
        

        <!-- LAST MINTED -->
        {#if lastMintedId !== null}
          <Window title="🎉 FRESH ADOPTION 🎉" width="full">
            <div class="p-4">
              <h3 class="mega-text text-center rainbow">YOUR NEWEST BROTHER</h3>
              <div
                class="border-4 border-green-500 p-2 mb-2 bg-gradient-to-r from-green-400 to-blue-500"
              >
                <img
                  src={getIPFSImageUrl(lastMintedId)}
                  alt="Schizo NFT #{lastMintedId}"
                  class="w-full"
                  loading="lazy"
                />
              </div>
              <div class="text-center matrix p-2">
                <div class="mega-text">BROTHER #{lastMintedId}</div>
                <div class="schizo-text blink">🎊 SUCCESSFULLY ADOPTED! 🎊</div>
              </div>
            </div>
          </Window>
        {/if}
      </div>
    </div>
  </div>

  <!-- SEIZURE WARNING (SCHIZO JOKE) -->
  <div class="w-full max-w-screen-xl mx-auto px-4 mt-4">
    <Window title="⚠️ MEDICAL DISCLAIMER ⚠️" width="full">
      <div
        class="p-3 matrix text-center schizo-text epilepsy-warning {blinkState
          ? 'blink'
          : ''}"
      >
        🚨 WARNING: This website may cause extreme enlightenment, spontaneous
        NFT addiction, and uncontrollable urges to buy more tokens! 🚨
      </div>
    </Window>
  </div>
</div>

<!-- SCHIZO 90s STYLES -->
<style>
  .schizo-text {
    font-size: 1.2rem;
    font-weight: bold;
    text-shadow:
      2px 2px 0px #ff00ff,
      -2px -2px 0px #00ffff;
  }

  .mega-text {
    font-size: 1.8rem;
    font-weight: bold;
  }

  .blink {
    animation: blink 1s infinite;
  }

  @keyframes blink {
    0%,
    50% {
      opacity: 1;
    }
    51%,
    100% {
      opacity: 0;
    }
  }

  .rainbow {
    background: linear-gradient(
      45deg,
      #ff0000,
      #ff7700,
      #ffdd00,
      #00ff00,
      #0099ff,
      #6600ff,
      #ff0099
    );
    background-size: 400% 400%;
    animation: rainbow 2s ease-in-out infinite;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  @keyframes rainbow {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  .matrix {
    background: #000;
    color: #00ff00;
    font-family: 'Courier New', monospace;
    padding: 10px;
    border: 2px solid #00ff00;
  }

  .popup {
    position: fixed;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    background: #c0c0c0;
    border: 2px solid #000;
    padding: 20px;
    box-shadow: 5px 5px 0px #000;
    max-width: 400px;
    animation: popup-bounce 0.5s ease-out;
  }

  @keyframes popup-bounce {
    0% {
      transform: translateX(-50%) scale(0.3);
    }
    50% {
      transform: translateX(-50%) scale(1.1);
    }
    100% {
      transform: translateX(-50%) scale(1);
    }
  }

  .visitor-counter {
    position: fixed;
    bottom: 10px;
    right: 10px;
    background: #ff0000;
    color: white;
    padding: 5px 10px;
    font-size: 0.8rem;
    border: 2px solid #000;
  }

  .mouse-trail {
    position: fixed;
    width: 10px;
    height: 10px;
    background: radial-gradient(circle, #ff00ff, transparent);
    border-radius: 50%;
    pointer-events: none;
    z-index: 1000;
  }

  .token-selector {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin: 10px 0;
  }

  .token-option {
    border: 3px solid #000;
    padding: 10px;
    cursor: pointer;
    text-align: center;
    background: #c0c0c0;
    transition: all 0.2s;
  }

  .token-option:hover {
    background: #ffff00;
    transform: rotate(-2deg);
  }

  .token-option.selected {
    background: #00ff00;
    border-color: #ff0000;
    transform: scale(1.1) rotate(2deg);
    animation: selected-pulse 1s infinite;
  }

  @keyframes selected-pulse {
    0%,
    100% {
      transform: scale(1.1) rotate(2deg);
    }
    50% {
      transform: scale(1.15) rotate(-2deg);
    }
  }

  /* MAXIMUM SCHIZO EFFECTS */
  .glitch {
    animation: glitch 2s infinite;
  }

  @keyframes glitch {
    0%,
    90%,
    100% {
      transform: translate(0);
    }
    10% {
      transform: translate(-2px, 2px);
    }
    20% {
      transform: translate(2px, -2px);
    }
    30% {
      transform: translate(-2px, -2px);
    }
    40% {
      transform: translate(2px, 2px);
    }
    50% {
      transform: translate(-2px, 2px);
    }
    60% {
      transform: translate(2px, -2px);
    }
    70% {
      transform: translate(-2px, -2px);
    }
    80% {
      transform: translate(2px, 2px);
    }
  }

  .spinning {
    animation: spin 10s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .shake {
    animation: shake 0.5s infinite;
  }

  @keyframes shake {
    0%,
    100% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-5px);
    }
    75% {
      transform: translateX(5px);
    }
  }

  .glitch-text {
    position: relative;
    animation: text-glitch 3s infinite;
  }

  .glitch-text::before,
  .glitch-text::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: inherit;
  }

  .glitch-text::before {
    animation: glitch-anim-1 2s infinite;
    color: #ff00ff;
    z-index: -1;
  }

  .glitch-text::after {
    animation: glitch-anim-2 3s infinite;
    color: #00ffff;
    z-index: -2;
  }

  @keyframes glitch-anim-1 {
    0%,
    5%,
    100% {
      transform: translate(0);
    }
    10% {
      transform: translate(-2px, 2px);
    }
    15% {
      transform: translate(2px, -2px);
    }
    20% {
      transform: translate(-2px, -2px);
    }
  }

  @keyframes glitch-anim-2 {
    0%,
    15%,
    100% {
      transform: translate(0);
    }
    5% {
      transform: translate(2px, 2px);
    }
    10% {
      transform: translate(-2px, -2px);
    }
    25% {
      transform: translate(2px, -2px);
    }
  }

  @keyframes text-glitch {
    0%,
    93%,
    100% {
      transform: translate(0);
    }
    1% {
      transform: translate(-2px, 1px);
    }
    2% {
      transform: translate(2px, -1px);
    }
    3% {
      transform: translate(-1px, 2px);
    }
    4% {
      transform: translate(1px, -2px);
    }
    5% {
      transform: translate(-1px, 1px);
    }
    6% {
      transform: translate(2px, 1px);
    }
    7% {
      transform: translate(-2px, -1px);
    }
    8% {
      transform: translate(1px, 2px);
    }
    9% {
      transform: translate(-1px, -2px);
    }
    10% {
      transform: translate(2px, -2px);
    }
  }

  .epilepsy-warning {
    background: linear-gradient(45deg, #ff0000, #ffff00, #ff0000, #ffff00);
    background-size: 400% 400%;
    animation:
      epilepsy-flash 0.1s infinite,
      rainbow 0.5s ease-in-out infinite;
    border: 3px solid #ff0000;
  }

  @keyframes epilepsy-flash {
    0%,
    50% {
      background-position: 0% 50%;
    }
    51%,
    100% {
      background-position: 100% 50%;
    }
  }

  .chaotic-hover:hover {
    animation: chaos 0.5s infinite;
    cursor: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2IDBMMTI4IDE2TDE2IDMyTDAgMTZMMTYgMFoiIGZpbGw9IiNGRjAwRkYiLz4KPC9zdmc+'),
      auto;
  }

  @keyframes chaos {
    0% {
      transform: rotate(0deg) scale(1);
    }
    25% {
      transform: rotate(90deg) scale(1.1);
    }
    50% {
      transform: rotate(180deg) scale(0.9);
    }
    75% {
      transform: rotate(270deg) scale(1.1);
    }
    100% {
      transform: rotate(360deg) scale(1);
    }
  }

  /* MATRIX RAIN EFFECT */
  .matrix-rain {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
    overflow: hidden;
  }

  .matrix-rain::before {
    content: '01101100011010010111011001100101';
    position: absolute;
    top: -100%;
    left: 0;
    color: #00ff00;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    animation: matrix-fall 5s linear infinite;
    opacity: 0.3;
  }

  @keyframes matrix-fall {
    to {
      top: 100%;
    }
  }

  /* PSYCHEDELIC BACKGROUND */
  @keyframes psychedelic {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  /* FLOATING ELEMENTS */
  .float {
    animation: float 3s ease-in-out infinite;
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
  }

  /* INTENSE BLINK */
  .intense-blink {
    animation: intense-blink 0.3s infinite;
  }

  @keyframes intense-blink {
    0%,
    50% {
      opacity: 1;
      color: #ff0000;
    }
    51%,
    100% {
      opacity: 0;
      color: #00ff00;
    }
  }
</style>
