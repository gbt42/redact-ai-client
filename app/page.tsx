"use client"

import React, { useState } from "react"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { Button, buttonVariants } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const URL = "https://redactai-production.up.railway.app/"

export default function IndexPage() {
  const [sensitive, setSensitive] = useState(
    "Hello Paulo Santos. The latest statement for your via 4005274213474735 was mailed to 123 Collingwood Street, Seattle, WA 98109. "
  )
  const [question, setQuestion] = useState(
    "What's the full mailing address?"
  )

  const [submitting, setSubmitting] = useState(false)

  const [redacted, setRedacted] = useState("")
  const [mapping, setMapping] = useState("")
  const [redactedAnswer, setRedactedAnswer] = useState("")
  const [unredactedAnswer, setUnredactedAnswer] = useState("")

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10 justify-items-center">
      <div className="flex flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          Redact AI
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
          Private inference over your sensitive data
        </p>
        <p className="max-w-[700px] text-sm font-medium text-black-500">
          Check out some example prompts in the <a href="https://github.com/gbt4/redactAI" className="text-blue hover:text-blue-700">Github.</a>
        </p>
      </div>
      <div className="flex flex-row w-full space-x-2 justify-center">
        <div className="flex flex-col gap-4 w-full md:w-1/2 justify-center">
          {/* <div className="flex flex-col mb-2"> */}
          <Label>Sensitive Document</Label>
          <Textarea
            placeholder="Your sensitive data here."
            value={sensitive}
            onChange={(e) => setSensitive(e.target.value)}
          />
          {/* </div> */}
          <Label>Question</Label>
          <Textarea
            placeholder="A question that you want to ask over your sensitive data."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <Button
            disabled={submitting}
            onClick={async () => {
              try {
                setSubmitting(true)
                const result = await fetch(URL + "redact", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    sensitive,
                    question,
                  }),
                }).then((r) => r.json())
                console.log(result)
                setRedacted(result.redacted)
                setMapping(result.mapping)

                const answers = await fetch(URL + "answer", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    sensitive,
                    question,
                    mapping,
                    redacted,
                  }),
                }).then((r) => r.json())
                setRedactedAnswer(answers.redacted)
                setUnredactedAnswer(answers.unredacted)
                console.log(answers)

                setSubmitting(false)
              } catch (e) {
                console.error(e)
                setSubmitting(false)
              }
            }}
          >
            {submitting ? "Loading" : "Submit"}
          </Button>

          <div className="mb-2 justify-items-center justify-content-center justify-content-center"></div>
          {redacted && (
            <>
              <Label>Redacted Document</Label>
              <Textarea className="resize-none" value={redacted} />
              <Label>Entity Mapping</Label>
              <Textarea className="resize-none" value={mapping} />
            </>
          )}
          {redactedAnswer && unredactedAnswer && (
            <>
              <Label>Redacted Answer</Label>
              <Textarea className="resize-none" value={redactedAnswer} />
              <Label>Unredacted Answer</Label>
              <Textarea className="resize-none" value={unredactedAnswer} />
            </>
          )}
        </div>
      </div>
    </section>
  )
}
