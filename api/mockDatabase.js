import PgMock2 from 'pgmock2';
const client = new PgMock2.default();

client.add('SELECT health_card_number, first_name, password, requests FROM public."Patients" WHERE health_card_number=$1', [(id)=>{return (id==='0000000000AA')}], {
    rowCount: 1,
    rows: [
        {
            health_card_number: '0000000000AA',
            first_name: 'Dopey',
            password: 'elmo',
        }
      ]
});

client.add('SELECT institute_id, name, password FROM public."Health_Providers" WHERE institute_id=$1', [(id)=>{return (id==='123456789')}], {
    rowCount: 1,
    rows: [
        {
            health_card_number: '123456789',
            first_name: 'Sunny Brook',
            password: 'sunnyBrook',
        }
      ]
});

client.add('SELECT name from public."Health_Providers" WHERE institute_id=$1', ['string'], {
    rowCount: 1,
    rows: [ { name: 'CAMH' } ],
});

client.add('SELECT * from public."Patients" WHERE health_card_number=$1', ['string'], {
    rowCount: 1,
    rows: [
        {
            health_card_number: '0000000000AA',
            first_name: 'Dopey',
            last_name: 'Donald',
            email: 'dopey.donald@gmail.com',
            password: 'elmo',
            requests: [ '345678912' ],
            access_list: []
        }
    ],
});

client.add('UPDATE public."Patients" SET requests=array_append(requests, $1) WHERE health_card_number=$2', [,'string'], {
    rowCount: 1,
    rows: [],
});

client.add('UPDATE public."Patients" SET requests=array_remove(requests, $1) WHERE health_card_number=$2', ['string','string'], {
    rowCount: 1,
    rows: [],
});

client.add('INSERT INTO public."Patients" VALUES ($1, $2, $3, $4, $5)', ['string', 'string', 'string', 'string', 'string'], {
    rowCount: 1,
    rows: [],
});

client.add('INSERT INTO public."Labs" VALUES ($1, $2, $3)', ['string', 'string', 'string'], {
    rowCount: 1,
    rows: [],
});

client.add('INSERT INTO public."Health_Providers" VALUES ($1, $2, $3)', ['string', 'string', 'string'], {
    rowCount: 1,
    rows: [],
});

export default client;
