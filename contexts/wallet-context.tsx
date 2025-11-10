"use client"

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"

interface WalletContextType {
  address: string | null
  isConnected: boolean
  isConnecting: boolean
  connect: () => Promise<void>
  disconnect: () => void
  targetAddress: string
  balance: string | null
  network: string | null
  isCorrectNetwork: boolean
  sendPayment: (to: string, amount: string) => Promise<string | null>
  refreshBalance: () => Promise<void>
  switchToTestnet: () => Promise<void>
  isTestnet: boolean
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

// Target wallet address and network
const TARGET_WALLET_ADDRESS = "0x46f90440678a21461d232555ed376f1D14aEe284"
const EXPECTED_CHAIN_ID = "0x14a34" // Base Sepolia testnet (84532 in decimal)
const BASE_MAINNET_CHAIN_ID = "0x2105" // Base mainnet (8453 in decimal)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [balance, setBalance] = useState<string | null>(null)
  const [network, setNetwork] = useState<string | null>(null)

  const handleAccountsChanged = useCallback((accounts: string[]) => {
    if (accounts.length === 0) {
      setAddress(null)
      setBalance(null)
    } else {
      setAddress(accounts[0])
    }
  }, [])

  const fetchBalance = useCallback(async (addr: string) => {
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        const bal = await window.ethereum.request({
          method: "eth_getBalance",
          params: [addr, "latest"],
        })
        // Convert from wei to ETH
        const ethBalance = parseInt(bal, 16) / 1e18
        setBalance(ethBalance.toFixed(4))
      }
    } catch (error) {
      console.error("Error fetching balance:", error)
    }
  }, [])

  const fetchNetwork = useCallback(async () => {
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        const chainId = await window.ethereum.request({ method: "eth_chainId" })
        setNetwork(chainId)
      }
    } catch (error) {
      console.error("Error fetching network:", error)
    }
  }, [])

  const checkConnection = useCallback(async () => {
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0) {
          setAddress(accounts[0])
          await fetchBalance(accounts[0])
          await fetchNetwork()
        }
      }
    } catch (error) {
      console.error("Error checking connection:", error)
    }
  }, [fetchBalance, fetchNetwork])

  // Refresh balance periodically
  useEffect(() => {
    if (address) {
      fetchBalance(address)
      const interval = setInterval(() => {
        fetchBalance(address)
      }, 10000) // Update every 10 seconds

      return () => clearInterval(interval)
    }
  }, [address, fetchBalance])

  // Check if already connected on mount
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      checkConnection()
      
      // Listen for account changes
      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", async () => {
        await fetchNetwork()
      })

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        }
      }
    }
  }, [checkConnection, handleAccountsChanged, fetchNetwork])

  const connect = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      alert("MetaMask is not installed. Please install MetaMask to continue.")
      window.open("https://metamask.io/download/", "_blank")
      return
    }

    setIsConnecting(true)
    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (accounts.length > 0) {
        const connectedAddress = accounts[0]
        setAddress(connectedAddress)
        await fetchBalance(connectedAddress)
        await fetchNetwork()

        // Check if connected address matches target address
        if (connectedAddress.toLowerCase() !== TARGET_WALLET_ADDRESS.toLowerCase()) {
          alert(
            `Connected wallet (${connectedAddress.slice(0, 6)}...${connectedAddress.slice(-4)}) does not match the required address (${TARGET_WALLET_ADDRESS.slice(0, 6)}...${TARGET_WALLET_ADDRESS.slice(-4)}). Please switch to the correct wallet.`
          )
        }
      }
    } catch (error: any) {
      console.error("Error connecting wallet:", error)
      if (error.code === 4001) {
        alert("Please connect to MetaMask.")
      } else {
        alert("Failed to connect wallet. Please try again.")
      }
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    setAddress(null)
    setBalance(null)
    setNetwork(null)
  }

  const sendPayment = async (to: string, amount: string): Promise<string | null> => {
    if (!window.ethereum || !address) {
      throw new Error("Please connect your wallet first")
    }

    // Validate recipient address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(to)) {
      throw new Error("Invalid recipient address format")
    }

    // Validate amount
    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      throw new Error("Invalid payment amount")
    }

    // Check balance
    if (balance && amountNum > parseFloat(balance)) {
      throw new Error("Insufficient balance")
    }

    try {
      // Convert ETH to wei (hex)
      const amountInWei = (amountNum * 1e18).toString(16)

      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: address,
            to: to,
            value: `0x${amountInWei}`,
            gas: "0x5208", // 21000 in hex (standard ETH transfer)
          },
        ],
      })

      // Refresh balance after transaction
      setTimeout(() => fetchBalance(address), 2000)
      return txHash
    } catch (error: any) {
      console.error("Error sending payment:", error)
      if (error.code === 4001) {
        throw new Error("Transaction cancelled by user")
      } else if (error.code === -32603) {
        throw new Error("Transaction failed. Please check your balance and try again.")
      } else {
        throw new Error(error.message || "Failed to send payment")
      }
    }
  }

  const refreshBalance = async () => {
    if (address) {
      await fetchBalance(address)
    }
  }

  const switchToTestnet = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed!")
      return
    }

    try {
      // Try to switch to Base Sepolia
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: EXPECTED_CHAIN_ID }],
      })
    } catch (error: any) {
      // If chain doesn't exist, add it
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: EXPECTED_CHAIN_ID,
              chainName: 'Base Sepolia',
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18
              },
              rpcUrls: ['https://sepolia.base.org'],
              blockExplorerUrls: ['https://sepolia.basescan.org']
            }],
          })
        } catch (addError) {
          console.error("Error adding network:", addError)
          alert("Failed to add Base Sepolia network")
        }
      } else {
        console.error("Error switching network:", error)
        alert("Failed to switch network")
      }
    }
  }

  const isCorrectNetwork = network === EXPECTED_CHAIN_ID
  const isTestnet = network === EXPECTED_CHAIN_ID

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected: !!address,
        isConnecting,
        connect,
        disconnect,
        targetAddress: TARGET_WALLET_ADDRESS,
        balance,
        network,
        isCorrectNetwork,
        sendPayment,
        refreshBalance,
        switchToTestnet,
        isTestnet,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>
      on: (event: string, handler: (...args: any[]) => void) => void
      removeListener: (event: string, handler: (...args: any[]) => void) => void
      isMetaMask?: boolean
    }
  }
}

