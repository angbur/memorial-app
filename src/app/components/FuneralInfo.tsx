export default function FuneralInfo() {
  return (
    <div className="mb-10">
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 lg:gap-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-700">Msza Św.</h2>
          <p className="text-gray-700 mt-2">
            <strong>Data:</strong> 31 marca 2025
          </p>
          <p className="text-gray-700 mt-2">
            <strong>Godzina:</strong> 12:00
          </p>
          <p className="text-gray-700 mt-2">
            <strong>Miejsce:</strong> Kościół św. Eugeniusza de Mazenod
          </p>
          <p className="text-gray-700 mt-4">
            Po mszy zapraszamy na uroczystości pogrzebowe.
          </p>
        </div>
        <div>
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2546.366297851745!2d18.1969263762155!3d50.34107299523365!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47111182d4c7dd1d%3A0xbea1b3300a8ee310!2sParafia%20rzymskokatolicka%20%C5%9Bw.%20Eugeniusza%20de%20Mazenod!5e0!3m2!1spl!2spl!4v1743320416458!5m2!1spl!2spl"
           width="400" 
           height="300" 
           style={{ border: 0 }}
           allowFullScreen
           loading="lazy"
           referrerPolicy="no-referrer-when-downgrade"
            title="Map of Kościół św. Eugeniusza de Mazenod"
        >
        </iframe>        
</div>
      </div>
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 lg:gap-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-700">Pogrzeb</h2>
          <p className="text-gray-700 mt-2">
            <strong>Data:</strong> 31 marca 2025
          </p>
          <p className="text-gray-700 mt-2">
            <strong>Godzina:</strong> 13:00
          </p>
          <p className="text-gray-700 mt-2">
            <strong>Miejsce:</strong> Cmentarz Komunalny Kuźniczka
          </p>
        </div>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2545.580675120931!2d18.192730588151495!3d50.355726020896455!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471111a3382e88ef%3A0xd714bec2d3939ea!2sCmentarz%20Komunalny%20Ku%C5%BAniczka!5e0!3m2!1spl!2spl!4v1743320480568!5m2!1spl!2spl"
          width="400"
          height="300"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Map of Cmentarz Komunalny Kuźniczka"
        />
        </div>
    </div>
  );
}
