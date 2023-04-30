import { NextApiRequest, NextApiResponse } from "next";
import reservationsHandler from "./reservations";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.url === "/reservations") {
    return reservationsHandler(req, res);
  }

  res.status(404).send("Not found");
}
