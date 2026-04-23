import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const AccordinComp = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">

      {/* Title */}
      <h2 className="text-4xl font-bold text-center text-yellow-600 mb-10 tracking-wide">
        Frequently Asked Questions
      </h2>

      <Accordion type="single" collapsible className="w-full space-y-4">
        <AccordionItem 
          value="item-1"
          className="border border-yellow-200 rounded-xl px-4 bg-yellow-50 shadow-sm"
        >
          <AccordionTrigger className="text-lg font-semibold hover:text-yellow-600">
            What is the idea behind Groomie?
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 leading-relaxed">
            Groomie was created to promote a healthy and confident lifestyle. 
            In today’s busy world, maintaining proper self-care, nutrition, and grooming 
            can be challenging. Our goal is to provide high-quality products in fashion, 
            food, and personal care that help individuals look good, feel confident, 
            and live better every day.
          </AccordionContent>
        </AccordionItem>

        {/* Item 2 */}
        <AccordionItem 
          value="item-2"
          className="border border-yellow-200 rounded-xl px-4 bg-yellow-50 shadow-sm"
        >
          <AccordionTrigger className="text-lg font-semibold hover:text-yellow-600">
            Can I shop online?
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 leading-relaxed">
            Yes, Groomie offers a seamless online shopping experience. 
            You can browse products, place orders, and get them delivered 
            directly to your doorstep — saving your time and effort.
          </AccordionContent>
        </AccordionItem>

        {/* Item 3 */}
        <AccordionItem 
          value="item-3"
          className="border border-yellow-200 rounded-xl px-4 bg-yellow-50 shadow-sm"
        >
          <AccordionTrigger className="text-lg font-semibold hover:text-yellow-600">
            How can I trust the product quality?
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 leading-relaxed">
            Customer trust is our top priority. We ensure all products go through 
            strict quality checks before reaching you. Additionally, we offer 
            an easy return policy so you can shop with confidence and peace of mind.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem 
          value="item-4"
          className="border border-yellow-200 rounded-xl px-4 bg-yellow-50 shadow-sm"
        >
          <AccordionTrigger className="text-lg font-semibold hover:text-yellow-600">
            What payment methods are accepted?
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 leading-relaxed">
            We accept multiple payment options including UPI, debit/credit cards, 
            net banking, and Cash on Delivery (COD) for your convenience.
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  )
}

export default AccordinComp