

# unit-scores-dashboard

A successor to SETool prompted using Claude, built with `next`. The majority of work took two prompts while the data processing can be found at [saikumarmk/unit-outcome-miner](https://github.com/saikumarmk/unit-outcome-miner).


### Operational Details

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

I recommend using `pnpm` over `yarn` or `npm`. To run locally:

```bash
pnpm run dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

For deployment:

```bash
pnpm run deploy-all
```

Exports the application to static JS/HTML/CSS then uses the `gh-pages` package to update the `gh-pages` branch using the `out` folder.
