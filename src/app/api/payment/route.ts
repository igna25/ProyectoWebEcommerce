import processPayment from '@/app/lib/actions/processPayment';
import {MercadoPagoConfig, Payment} from 'mercadopago';
import { NextRequest, NextResponse } from 'next/server';
 
const client = new MercadoPagoConfig({accessToken: process.env.MP_ACCESS_TOKEN!})
export async function POST(
    req: NextRequest
) {
    try {
        const body:any= await req.json()
        const payment = await new Payment(client).get({id:body.data.id})

        const cartid = payment.metadata.cartid

        if(!cartid){
            return NextResponse.json({ msg:"Invalid payment" }, { status: 400 });    
        }
        const result = await processPayment(cartid, body.data.id)

        return NextResponse.json({ msg:"Payment successfull" }, { status: 200 });
    } 
    catch (err) {
        return NextResponse.json({ msg: "Error trying to fetch products" }, { status: 500 });
    }
}

export const revalidate = 60