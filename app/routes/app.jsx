import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError} from "@remix-run/react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import {  MONTHLY_PLAN,authenticate } from "../shopify.server";


export const links = () => [{ rel: "stylesheet", href: polarisStyles }];
const client = new shopify.clients.Graphql({session});
const data = await client.query({
  data: {
    "query": `mutation AppPurchaseOneTimeCreate($name: String!, $price: MoneyInput!, $returnUrl: URL!) {
      appPurchaseOneTimeCreate(name: $name, returnUrl: $returnUrl, price: $price) {
        userErrors {
          field
          message
        }
        appPurchaseOneTime {
          createdAt
          id
        }
        confirmationUrl
      }
    }`,

    "variables": {
      "name": "1000 imported orders.",
      "returnUrl": "http://super-duper.shopifyapps.com/",
      "price": {
        "amount": 10.0,
        "currencyCode": "USD"
      }
    },
  },
});
console.log("Data.....", data);

// export const loader = async ({ request }) => {
//   const { admin, billing  } = await authenticate.admin(request);
//   const result = await admin.graphql(`
//   #graphql
//   query Shop {
//   app {
//     installation {
//       launchUrl
//       activeSubscriptions {
//         id
//         name
//         createdAt
//         returnUrl
//         status
//         currentPeriodEnd
//         trialDays
//       }
//     }
//   }
// }`,
//     { variables: {} }
//   );

//   const resultJson = await result.json();

//   const { activeSubscriptions, launchUrl  } = resultJson.data.app.installation;

//   console.log("Result AS: ", activeSubscriptions)

//     if (activeSubscriptions.length < 1) {
//      await billing.require(
//       {
//         plans: [MONTHLY_PLAN],
//         isTest: true,
//         onFailure: async () => {
//           billing.request(
//             {
//               plan: MONTHLY_PLAN,
//               returnURL: launchUrl
//             }
//           )
//         }
//       }
//     )
//      console.log("Active: ", activeSubscriptions);
//    }

//   return json({ apiKey: process.env.SHOPIFY_API_KEY || "" });
// };

export default function App() {
  const { apiKey } = useLoaderData();

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <ui-nav-menu>
        <Link to="/app" rel="home">
          Home
        </Link>

      </ui-nav-menu>
      <Outlet />
    </AppProvider>
  );
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};

