"use client"

import { useToast } from "@/components/alert/alert";
import { alertType } from "@/lib/constants";
import { Button } from "react-bootstrap";

interface MyComponentProps  {
  callback1 : () => void;
}

export default function ClientTest(props : any) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const notify = () => useToast({ type: alertType.success, message: 'HELLO' });
  return (
    <>
          <Button onClick={notify}>Click Me</Button>
    </>
  )
}