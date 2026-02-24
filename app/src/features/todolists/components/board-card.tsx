"use client";

import Link from "next/link";
import { cn } from "@/lib/ui/cn";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BoardTodoList } from "../types";

/* --------------------------------------------------------------------------
   Props
   -------------------------------------------------------------------------- */

interface BoardCardProps {
  list: BoardTodoList;
}

/* --------------------------------------------------------------------------
   Component
   -------------------------------------------------------------------------- */

export function BoardCard({ list }: BoardCardProps) {
  const { statusCounts, totalTodos } = list;

  return (
    <Link
      href={`/todolists/${list.id}`}
      className={cn(
        "block rounded-xl transition-all duration-150",
        "hover:scale-[1.01] hover:shadow-md",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
      )}
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle>{list.name}</CardTitle>
          {list.description && (
            <CardDescription>{list.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="default">
              {statusCounts.TODO} Todo
            </Badge>
            <Badge variant="warning">
              {statusCounts.IN_PROGRESS} In Progress
            </Badge>
            <Badge variant="success">
              {statusCounts.DONE} Done
            </Badge>
          </div>
          <p className="mt-3 text-xs text-text-muted">
            {totalTodos} {totalTodos === 1 ? "task" : "tasks"} total
            {" \u00B7 "}
            Created {list.createdAt.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
