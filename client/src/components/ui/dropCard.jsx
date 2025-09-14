"use client";
import React from "react";
import { Button } from "./button";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Card } from "./card";
import { Check, CheckCheck } from "lucide-react";

const DropCard = ({ item }) => {
  const getRegisterConfig = () => {
    switch (item.title) {
      case "Doctor":
        return {
          url: "/api/auth/creation?user_type=doctor",
          text: "Register as doctor",
        };
      case "NGO / Clinic":
        return {
          url: "/api/auth/creation?user_type=ngo",
          text: "Register as ngo",
        };
      case "Corporate (CSR)":
        return {
          url: "/api/auth/creation?user_type=corporate",
          text: "Register as Corporate",
        };
      default:
        return {
          url: "/api/auth/creation",
          text: "Register Now",
        };
    }
  };

  const { url, text } = getRegisterConfig();

  return (
    <Card className={"bg-transparent border-0"}>
      <div className="flex flex-col space-y-4 text-white p-4">
        <h2 className="text-primary-400 text-3xl">
          {item.cta}/
          <span className="text-xl text-white font-semibold">
            {item.catchPhrase}
          </span>
        </h2>
        <div className="flex flex-col md:flex-row gap-4 bg-muted-foreground/10 rounded-md">
          <img
            src={item?.img ?? ""}
            alt="Image"
            className="w-full md:w-1/2 h-48 md:h-[300px] object-cover rounded-md md:rounded-l-md md:rounded-r-none"
          />
          <ul className="text-md text-white/80 space-y-2 md:w-1/2 p-4">
            {item.features?.map((point, i) => (
              <li key={i} className="flex gap-2 text-[1.1rem]">
                <CheckCheck/>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xl px-2 leading-normal">{item.description}</p>
        <RegisterLink postLoginRedirectURL={url}>
          <Button className="cursor-pointer" variant={"outline"}>
            Register Now
          </Button>
        </RegisterLink>
      </div>
    </Card>
  );
};

export default DropCard;
