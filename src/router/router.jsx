import React, { useEffect } from "react";
import { useRoutes, useNavigate } from "react-router-dom";

import BasicLayout from "@/layout/BasicLayout";
import AccountAuthorize from "@/pages/AccountAuthorize";
import ProductSearch from "@/pages/ProductSearch";
import OrderCreate from "@/pages/Order/OrderCreate";
import OrderList from "@/pages/Order/OrderList";
import NotFoundPage from "@/Exception/404";

const Redirect = ({ to }) => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to);
  });
  return null;
};

const routerConfig = [
  {
    path: "/",
    element: <Redirect to="/accountAuthorize" />,
  },
  {
    path: "/",
    element: <BasicLayout />,
    children: [
      {
        path: "accountAuthorize",
        element: <AccountAuthorize />,
      },
      {
        path: "productSearch",
        element: <ProductSearch />,
      },
      {
        path: "order",
        children: [
          {
            path: "orderCreate",
            element: <OrderCreate />,
          },
          {
            path: "orderList",
            element: <OrderList />,
          },
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
];

export default () => useRoutes(routerConfig);
