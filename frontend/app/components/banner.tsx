const Banner = () => {
  return (
    <div className="w-full space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Comité Paritario
          </h1>
          <p className="text-muted-foreground">
            Aquí tienes un resumen de lo que está pasando en la empresa
          </p>
        </div>
      </div>

      {/* Banner */}
      <div
        className="relative w-full h-[250px] md:h-[350px] rounded-xl flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: "url('/intranet.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >

      </div>

    </div>
  );
};

export default Banner;