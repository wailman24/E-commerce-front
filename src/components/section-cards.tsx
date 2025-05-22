"use client";

import { useContext, useEffect, useState } from "react";
//import { getcardsdata } from "@/lib/api"; // adapte le chemin
import { getcardsdata } from "../services/home/order"; // adapte le chemin
import { Card, CardHeader, CardTitle, CardDescription, CardAction } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { IconTrendingUp } from "@tabler/icons-react";
import { AppContext } from "../Context/AppContext";

export function SectionCards() {
  const appContext = useContext(AppContext);
  if (!appContext) throw new Error("there is error in AppProvider");

  const { token } = appContext;
  const [cards, setCards] = useState<{ title: string; value: string | number }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const data = await getcardsdata(token);

      if ("error" in data) {
        setError(data.error);
        return;
      }

      if (data.role === "admin") {
        setCards([
          { title: "Total Orders", value: data.totalOrders },
          { title: "Total Revenue", value: `${data.totalRevenue.toLocaleString()} DA` },
          { title: "Total Users", value: data.totalUsers },
          { title: "total Sellers", value: data.totalSellers },
        ]);
      } else if (data.role === "seller") {
        setCards([
          { title: "My Products", value: data.myProducts },
          { title: "My Orders", value: data.myOrders },
          { title: "My Revenue", value: `${data.myRevenue.toLocaleString()} DA` },
          { title: "Pending Products", value: data.pendingProducts },
        ]);
      }
    }

    fetchData();
  }, [token]);

  if (error) return <div className="p-4 text-red-500">⚠️ {error}</div>;

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index} className="@container/card" data-slot="card">
          <CardHeader>
            <CardDescription>{card.title}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{card.value}</CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingUp />
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
