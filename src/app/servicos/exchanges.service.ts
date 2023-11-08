import { Injectable } from "@angular/core"
import { Funcoes } from "./funcoes.service";

const int = '1h' // interval
const s = 'BTCUSDT'

@Injectable()
export class ExchangeService
{
    constructor(private funcS: Funcoes){}

    async pumpsBinance()
    {
        let api_info = await fetch('https://api.binance.com/api/v3/exchangeInfo'),
            s = await api_info.json(),
            p = s.symbols, // PARES
            perc = 0, // DIFERENÇA PERCENTAL ENTRE MAIOR ALTA E MENOR BAIXA
            pumps = [],
            c: any = [], // ARRAY COM O CLOSES PRICES
            rsiCurto = '',
            rsiMedio = '',
            rsiLongo = ''
            

            for(let i in p)
            {
                if(p[i].status == 'TRADING')
                {
                    let symbol = p[i].symbol
                    let kl_api = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${int}&limit=180`),
                    k = await kl_api.json()

                    for(let i = 0; i < k.length; i++)
                    {
                        let time = new Date(k[i][0]),
                            o = k[i][1],
                            h = k[i][2],
                            l = k[i][3]
                        
                        c.push(k[i][4])
                       

                        if(i == k.length -1)
                        {
                            rsiCurto = this.funcS.calcRsiCurto(c)
                            rsiMedio = this.funcS.calcRsiMedio(c)
                            rsiLongo = this.funcS.calcRsiLongo(c)
                        }

                        if(rsiCurto == 'SOBREVENDIDO' && rsiMedio == 'SOBREVENDIDO' && rsiLongo == 'SOBREVENDIDO')
                            console.log(symbol + ' RSI curto e médio e longo estão sobrevendidos')

                        // if(rsi != '' )
                        //     console.log('RSI -> ' + symbol + '  -> ' + rsi)

                        if(o < c) // ABERTURA TEM QUE SER MENOR QUE O FECHAMENTO 
                        {
                            perc = (h - l) / l * 100

                            if(perc > 50)
                                pumps.push({ s: symbol, h: h, l: l, dif: perc, rsi: rsiCurto, d: time })
                        }
                    }
                }
            }   
            
            for(let i in pumps)
            {
                console.log(pumps[i].s + ' h: ' + pumps[i].h + ' l: ' + pumps[i].l + ' dif: ' + pumps[i].dif 
                + ' RSI: ' + pumps[i].rsi)
            }

            let pp = this.funcS.count(pumps, 'Binance')
            for(let i = 0; i < pp.length; i++) // ELIMINAR VALORES REPETIDOS
            {
                let cont = 0

                for(let j  = 0; j < pp.length; j++)
                {
                    if(pp[i].s == pp[j].s)
                    {
                        ++cont
                        if(cont > 0)
                            pp.splice(j, 1)
                    }
                }
            }

            pp.sort( (a, b) =>
            {
                return (b.perc > a.perc) ? 1 : ((a.perc > b.perc) ? -1 : 0)
            })


            // for(let i in pp)
            //     console.log(pp[i].s + ' -> DIF: ' + pp[i].perc + ' Data: ' + pp[i].d + ' h: ' + pp[i].h + ' l: ' + pp[i].l
            //     + ' cont: ' + pp[i].cont + ' Exchange: ' + pp[i].exc)

            // console.log(pp.length)    
        // for(let i in candles)
        // {
        //     console.log('Time: ' + k[i][0])
        //     console.log('Open: ' + k[i][1])
        //     console.log('High: ' + k[i][2])
        //     console.log('Low: ' + k[i][3])
        //     console.log('Close: ' + k[i][4])

        //     console.log('---------------------------------------------------')
        // }

        return pp
    }
    
    async dumpsBinance()
    {
        let api_info = await fetch('https://api.binance.com/api/v3/exchangeInfo'),
            s = await api_info.json(),
            p = s.symbols, // PARES
            perc = 0, // DIFERENÇA PERCENTAL ENTRE MAIOR ALTA E MENOR BAIXA
            dumps = [],
            c: any = [], // ARRAY COM O CLOSES PRICES
            rsi = ''

            for(let i in p)
            {
                if(p[i].status == 'TRADING')
                {
                    let symbol = p[i].symbol
                    let kl_api = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${int}&limit=180`),
                    k = await kl_api.json()

                    for(let i = 0; i < k.length; i++)
                    {
                        let time = new Date(k[i][0]),
                            o = k[i][1],
                            h = k[i][2],
                            l = k[i][3]
                        
                        c.push(k[i][4])
                       

                        if(i == k.length -1)
                        {
                            rsi = this.funcS.calcRsiCurto(c)
                            
                            // if(rsi == 'SOBREVENDIDO')
                            //     console.log(symbol + ' RSI -> ' + rsi)
                        }
                        

                        if(o > c) // ABERTURA MAIOR DO QUE O FECHAMENTO
                        {
                            perc = (h - l) / l * 100

                            if(perc > 50)
                            {
                                dumps.push({ s: symbol, h: h, l: l, dif: perc, rsi: rsi, d: time })
                                // console.log('DUMP -> ' + symbol + ' -> percent: ' + perc)
                            }
                        }
                    }
                }
            }   

            let dmp = this.funcS.count(dumps, 'Binance')

            for(let i = 0; i < dmp.length; i++) // ELIMINAR VALORES REPETIDOS
            {
                let cont = 0

                for(let j  = 0; j < dmp.length; j++)
                {
                    if(dmp[i].s == dmp[j].s)
                    {
                        ++cont
                        if(cont > 0)
                            dmp.splice(j, 1)
                    }
                }
            }


            dmp.sort( (a, b) =>
            {
                return (b.perc > a.perc) ? 1 : ((a.perc > b.perc) ? -1 : 0)
            })


            // for(let i in dmp)
            //     console.log(dmp[i].s + ' -> DIF: ' + dmp[i].perc + ' Data: ' + dmp[i].d + ' h: ' + dmp[i].h + ' l: ' 
            //     + dmp[i].l + ' cont: ' + dmp[i].cont + ' Exchange: ' + dmp[i].exc)

            // console.log(pp.length)    
        // for(let i in candles)
        // {
        //     console.log('Time: ' + k[i][0])
        //     console.log('Open: ' + k[i][1])
        //     console.log('High: ' + k[i][2])
        //     console.log('Low: ' + k[i][3])
        //     console.log('Close: ' + k[i][4])

        //     console.log('---------------------------------------------------')
        // }

        return dmp
    }

    async dumpsMexc()
    {
        let url = await fetch('https://api.mexc.com/api/v3/exchangeInfo'),
            symbols = await url.json(),
            p = symbols.symbols,
            perc = 0, // DIFERENÇA PERCENTAL ENTRE MAIOR ALTA E MENOR BAIXA
            dumps: any = [],
            c: any = [] // ARRAY COM O CLOSES PRICES
            
            for(let i in p)
            {
                if(p[i].status == 'ENABLED')
                {
                    let s = p[i].symbol
                    let kl_api = await fetch(`https://api.mexc.com/api/v3/klines?Symbol=${s}&limit=500&Interval=60m`),
                    k = await kl_api.json()

                    for(let i = 0; i < k.length; i++)
                    {
                        let time = new Date(k[i][0]),
                            o = k[i][1],
                            h = k[i][2],
                            l = k[i][3]
                        
                        c.push(k[i][4])
                       

                        if(o > c) // ABERTURA MAIOR DO QUE O FECHAMENTO
                        {
                            perc = (h - l) / l * 100

                            if(perc > 50)
                            {
                                dumps.push({ s: s, h: h, l: l, dif: perc, d: time })
                                console.log('DUMP MEXC-> ' + s + ' -> percent: ' + perc)
                            }
                        }
                    }
                }
            }   

            let dmp = this.funcS.count(dumps, 'Mexc')

            for(let i = 0; i < dmp.length; i++) // ELIMINAR VALORES REPETIDOS
            {
                let cont = 0

                for(let j  = 0; j < dmp.length; j++)
                {
                    if(dmp[i].s == dmp[j].s)
                    {
                        ++cont
                        if(cont > 0)
                            dmp.splice(j, 1)
                    }
                }
            }


            dmp.sort( (a, b) =>
            {
                return (b.perc > a.perc) ? 1 : ((a.perc > b.perc) ? -1 : 0)
            })


            for(let i in dmp)
                console.log(dmp[i].s + ' -> DIF: ' + dmp[i].perc + ' Data: ' + ' h: ' + dmp[i].h + ' l: ' 
                + dmp[i].l + ' cont: ' + dmp[i].cont + ' Exchange: ' + dmp[i].exc)

            // console.log(pp.length)    
       
            // 0	Open time
            // 1	Open
            // 2	High
            // 3	Low
            // 4	Close  

        return dmp
    }

    async rsi()
    {
        let api_info = await fetch('https://api.binance.com/api/v3/exchangeInfo'),
            s = await api_info.json(),
            p = s.symbols, // PARES
            perc = 0, // DIFERENÇA PERCENTAL ENTRE MAIOR ALTA E MENOR BAIXA
            pumps = [],
            c: any = [], // ARRAY COM O CLOSES PRICES
            rsi = ''
            

            for(let i in p)
            {
                if(p[i].status == 'TRADING')
                {
                    let symbol = p[i].symbol
                    let kl_api = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${int}&limit=180`),
                    k = await kl_api.json()

                    for(let i = 0; i < k.length; i++)
                    {
                        let time = new Date(k[i][0]),
                            o = k[i][1],
                            h = k[i][2],
                            l = k[i][3]
                        
                        c.push(k[i][4])
                       

                        if(i == k.length -1)
                            rsi = this.funcS.calcRsiCurto(c)

                        // if(rsi != '' )
                        //     console.log('RSI -> ' + symbol + '  -> ' + rsi)

                        if(o < c) // ABERTURA TEM QUE SER MENOR QUE O FECHAMENTO 
                        {
                            perc = (h - l) / l * 100

                            if(perc > 50)
                                pumps.push({ s: symbol, h: h, l: l, dif: perc, rsi: rsi, d: time })
                        }
                    }
                }
            }   
            
            for(let i in pumps)
            {
                console.log(pumps[i].s + ' h: ' + pumps[i].h + ' l: ' + pumps[i].l + ' dif: ' + pumps[i].dif 
                + ' RSI: ' + pumps[i].rsi)
            }

            let pp = this.funcS.count(pumps, 'Binance')
            for(let i = 0; i < pp.length; i++) // ELIMINAR VALORES REPETIDOS
            {
                let cont = 0

                for(let j  = 0; j < pp.length; j++)
                {
                    if(pp[i].s == pp[j].s)
                    {
                        ++cont
                        if(cont > 0)
                            pp.splice(j, 1)
                    }
                }
            }

            pp.sort( (a, b) =>
            {
                return (b.perc > a.perc) ? 1 : ((a.perc > b.perc) ? -1 : 0)
            })


            // for(let i in pp)
            //     console.log(pp[i].s + ' -> DIF: ' + pp[i].perc + ' Data: ' + pp[i].d + ' h: ' + pp[i].h + ' l: ' + pp[i].l
            //     + ' cont: ' + pp[i].cont + ' Exchange: ' + pp[i].exc)

            // console.log(pp.length)    
        // for(let i in candles)
        // {
        //     console.log('Time: ' + k[i][0])
        //     console.log('Open: ' + k[i][1])
        //     console.log('High: ' + k[i][2])
        //     console.log('Low: ' + k[i][3])
        //     console.log('Close: ' + k[i][4])

        //     console.log('---------------------------------------------------')
        // }

        return pp
    }

    async testeCandle()
    {
        let kl_api = await fetch(`https://api.binance.com/api/v3/klines?symbol=UNFIUSDT&interval=1d&limit=180`),
            k = await kl_api.json()

        for(let i in k)
        {
            let time = new Date(k[i][0]),
            o = k[i][1],
            h = k[i][2],
            l = k[i][3],
            c = k[i][4]

            if(o < c) // ABERTURA TEM QUE SER MENOR QUE O FECHAMENTO 
            {
                let perc = (h - l) / l * 100

                console.log('Percentual -> ' + perc + ' H -> ' + h + ' L -> ' + l + ' Data -> ' + time)
            }
        }
    }
}