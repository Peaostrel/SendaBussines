# Sprint risks

Research only. Nothing in this note is implemented. Checked on 14 November 2026.

The sprint would deposit testnet USDC through SEP-24, then fund the existing Trustless Work v2 escrow with that balance and release milestone 0. Supplier name and country stay off the public ledger. The country would go in an event log that does not exist yet.

## Asset compatibility

The test anchor publishes USDC with the same issuer the escrow already uses.

| Source | What it says |
| --- | --- |
| `https://testanchor.stellar.org/.well-known/stellar.toml` | HTTP 200. Currencies: `SRT` (`GCDNJUBQSX7AJWLJACMJ7I4BC3Z47BQUTMHEICZLE6MU4KQBRYG5JY6B`), `USDC` (`GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5`), and native XLM. |
| `https://testanchor.stellar.org/sep24/info` | HTTP 200. Deposit and withdraw are enabled for `SRT`, `native`, and `USDC`. Each has `min_amount` 1 and `max_amount` 10. Fees are disabled. |
| `https://testanchor.stellar.org/info` | HTTP 404. The SEP-24 document is under `/sep24/info`, not the host root. |
| `apps/api/src/escrow/constants.ts` | `USDC_TESTNET_ISSUER` is `GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5`. |

The USDC issuer matches. A deposit of that USDC can fund the escrow without a second asset. `SRT` and native XLM cannot. The anchor caps one deposit at 10 USDC. The recorded escrow run was exactly 10 USDC. A larger payment needs more than one deposit, or it does not fit this anchor.

**Plan B.** If the anchor USDC issuer changes, do not fund the escrow with the other asset. Keep using the Circle testnet issuer already in `constants.ts`, and fund the treasury with a direct testnet payment instead of SEP-24.

## Where the deposit would land

SEP-24 credits the Stellar account that completes SEP-10 with the anchor (`WEB_AUTH_ENDPOINT` is `https://testanchor.stellar.org/auth`). The escrow spends USDC from `STELLAR_ADMIN_PUBLIC`, using `TREASURY_SECRET` on the API. Those two accounts have to be the same one. A deposit into a different company wallet would not be the balance the escrow funds.

That account needs a trustline for USDC issued by `GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5` before the anchor can pay it. This note does not check whether the live treasury already has that trustline.

**Plan B.** Create the trustline on the treasury before the demo. If the deposit account and the treasury ever differ, stop and fund the treasury directly. Do not add a second signer to bridge them during the sprint.

## Trustless Work v2 API key

Funding and release call `https://beta.api.trustlesswork.com` with `TRUSTLESS_WORK_API_KEY`. The example files leave the key empty. The v1 hosts (`dev.api.trustlesswork.com` and `api.trustlesswork.com`) are the wrong API. Without a beta key the new escrow run cannot complete. The October 2026 run remains valid prior evidence; it is not a substitute for a run funded by a SEP-24 deposit.

**Plan B.** Request the key from the Trustless Work backoffice before the sprint demo. If it is not issued in time, show the recorded testnet escrow and mark the new funding and release as not run. Do not point the client at the v1 hosts.

## Test anchor availability

On 14 November 2026 the toml and `/sep24/info` both answered. The anchor is a public reference server. It can be down, rate-limited, or changed without notice. SEP-10 against the anchor is a second login, separate from the app's own SEP-10.

**Plan B.** If the anchor is down during the demo, send testnet USDC to the treasury with a normal payment, say so in the evidence notes, and do not describe that payment as a SEP-24 deposit.

## Custody of `TREASURY_SECRET`

The API holds `TREASURY_SECRET` and signs funding and release. For this testnet pilot that is an accepted tradeoff. It is not acceptable on mainnet.

In the committed API, any valid session can call the payment routes. The server then signs with the treasury secret. Restricting those routes to the treasury account is not part of this review prep.

**Plan B.** On testnet, keep the secret only in the API host environment and never in the web app. Before any mainnet work, stop and move signing to the company wallet so the server does not hold the secret.
