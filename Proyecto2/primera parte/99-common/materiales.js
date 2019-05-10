//materiales sacados de tabla
var material_brass = new Material();
material_brass.set_k_ambient([0.329412,0.223529,0.027451]);
material_brass.set_k_diffuse([0.780392,0.568627,0.113725]);
material_brass.set_k_spec([0.992157,0.941176,0.807843]);
material_brass.set_exp_spec(27.8974);
material_brass.setf0(0.99);
material_brass.setm(0.09);

var material_bronze = new Material();
material_bronze.set_k_ambient([0.21,0.12,0.05]);
material_bronze.set_k_diffuse([0.71,0.42,0.18]);
material_bronze.set_k_spec([0.39,0.27,0.16]);
material_bronze.set_exp_spec(25.6);
material_bronze.setf0(0.99);
material_bronze.setm(0.14);

var material_copper = new Material();//pulido
material_copper.set_k_ambient([0.22,0.08,0.02]);
material_copper.set_k_diffuse([0.55,0.21,0.06]);
material_copper.set_k_spec([0.58,0.22,0.06]);
material_copper.set_exp_spec(51);
material_copper.setf0(0.99);
material_copper.setm(0.14);

var material_iron = new Material(); //hierro fundido
material_iron.set_k_ambient([0.01,0.01,0.01]);
material_iron.set_k_diffuse([0.2,0.2,0.2]);
material_iron.set_k_spec([0.9,0.9,0.9]);
material_iron.set_exp_spec(25.6);
material_iron.setf0(0.6);
material_iron.setm(0.15);

var material_ceramico = new Material();
material_ceramico.set_k_ambient([0.25,0.148,0.06475]);
material_ceramico.set_k_diffuse([0.4,0.2368,0.1036]);
material_ceramico.set_k_spec([0.774597,0.458561,0.200621]);
material_ceramico.set_exp_spec(7.8974);
material_ceramico.setf0(0.05);
material_ceramico.setm(0.95);

var material_gold = new Material();
material_gold.set_k_ambient([0.24725,0.1995,0.0745]);
material_gold.set_k_diffuse([0.75164,0.60648,0.22648]);
material_gold.set_k_spec([0.628281,0.555802,0.366065]);
material_gold.set_exp_spec(51.2);

var material_blackplastic = new Material();
material_blackplastic.set_k_ambient([0.0,0.0,0.0]);
material_blackplastic.set_k_diffuse([0.01,0.01,0.01]);
material_blackplastic.set_k_spec([0.5,0.5,0.5]);
material_blackplastic.set_exp_spec(32.0);

var material_redplastic = new Material();
material_redplastic.set_k_ambient([0.15,0,0]);
material_redplastic.set_k_diffuse([0.8,0,0]);
material_redplastic.set_k_spec([0.85,0.7,0.7]);
material_redplastic.set_exp_spec(46.8);
material_redplastic.setf0(0.06);
material_redplastic.setm(0.08);

var material_silver = new Material();
material_silver.set_k_ambient([0.19225,0.19225,0.19225]);
material_silver.set_k_diffuse([0.50754,0.50754,0.50754]);
material_silver.set_k_spec([0.508273,0.508273,0.508273]);
material_silver.set_exp_spec(51.2);
material_silver.setf0(0.99);
material_silver.setm(0.14);

var material_pearl = new Material();
material_pearl.set_k_ambient([0.25,0.20725,0.20725]);
material_pearl.set_k_diffuse([1.0,0.829,0.829]);
material_pearl.set_k_spec([0.296648,0.296648,0.296648]);
material_pearl.set_exp_spec(11.264);

//material para el plano, totalmente difuso sin especularidad
var material_plano = new Material();
material_plano.set_k_ambient([0.2,0.2,0.2]);
material_plano.set_k_diffuse([0.5,0.5,0.5]);
material_plano.set_k_spec([0.0,0.0,0.0]);
material_plano.set_exp_spec(1.0);
material_plano.setf0(0.02);
material_plano.setm(0.90);

var material_barro = new Material();
material_barro.set_k_ambient([0.2,0.2,0.2]);
material_barro.set_k_diffuse([0.5,0.5,0.5]);
material_barro.set_k_spec([0.0,0.0,0.0]);
material_barro.set_exp_spec(1.0);