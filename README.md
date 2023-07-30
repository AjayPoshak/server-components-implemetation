# server-components-implementation

This is an implementation of React server components inspired from [Dan Abramov's writeup](https://github.com/reactwg/server-components/discussions/5) about it. I followed along all the 6 steps mentioned, and also implemented all the 8 challenges listed at the end.

## Instructions

It required nodejs version above `20`. And to run any step or challenge in this repo, follow these steps.

### Running any step upto step5

1. In `package.json`, change the dev script path to wanted step. For example to run step4

```
"dev": "nodemon -- --experimental-loader ./src/step4/node-jsx-loader.js ./src/step4/server.js",
```

2. First install dependencies `yarn`. Then run `yarn dev`, and open `http://localhost:5005` on your browser.

### Running any step beyond step5, and any challenge

1. In `package.json`, change the `start:rsc` and `start:ssr` paths, for example to run step6

   ```
    "start:rsc": "nodemon -- --experimental-loader ./src/step6/node-jsx-loader.js ./src/step6/server/rsc.js",
    "start:ssr": "nodemon -- --experimental-loader ./src/step6/node-jsx-loader.js ./src/step6/server/ssr.js"
   ```

2. First install dependencies `yarn`. Then run `yarn start` and open `http://localhost:5005` on your browser.

### Implementation List

#### Steps

1. [Step3](https://github.com/AjayPoshak/server-components-implemetation/tree/main/src/step3)
2. [Step4](https://github.com/AjayPoshak/server-components-implemetation/tree/main/src/step4)
3. [Step5](https://github.com/AjayPoshak/server-components-implemetation/tree/main/src/step5)
4. [Step6](https://github.com/AjayPoshak/server-components-implemetation/tree/main/src/step6)

#### Challenges

1. [Challenge1](https://github.com/AjayPoshak/server-components-implemetation/tree/main/src/challenge1)
2. [Challenge2](https://github.com/AjayPoshak/server-components-implemetation/tree/main/src/challenge2)
3. [Challenge3](https://github.com/AjayPoshak/server-components-implemetation/tree/main/src/challenge3)
4. [Challenge4](https://github.com/AjayPoshak/server-components-implemetation/tree/main/src/challenge4)
5. [Challenge5](https://github.com/AjayPoshak/server-components-implemetation/tree/main/src/challenge5)
6. [Challenge6](https://github.com/AjayPoshak/server-components-implemetation/tree/main/src/challenge6)
7. [Challenge7](https://github.com/AjayPoshak/server-components-implemetation/tree/main/src/challenge7)
8. [Challenge8](https://github.com/AjayPoshak/server-components-implemetation/tree/main/src/challenge8)

**P.S**: I don't have README files for steps because I think Dan Abramov's blog has done a great job explaining the implementation details.
