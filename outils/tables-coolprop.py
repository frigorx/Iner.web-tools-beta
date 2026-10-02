# Génère les tables de saturation (bulle / rosée) de cerveau_v5.js avec CoolProp.
# Une seule source pour la réglette, le diagnostic, les incondensables et l'identification.
# Usage : python outils/tables-coolprop.py   (réécrit le bloc TABLES-COOLPROP de cerveau_v5.js)
import re, json, pathlib, CoolProp
import CoolProp.CoolProp as CP

ICI = pathlib.Path(__file__).resolve().parent.parent
CERVEAU = ICI / "cerveau_v5.js"

PURS = {"R11":"R11","R113":"R113","R114":"R114","R115":"R115","R12":"R12","R123":"R123","R1233zd":"R1233zd(E)",
  "R1234yf":"R1234yf","R1234ze(E)":"R1234ze(E)","R124":"R124","R125":"R125","R1270":"Propylene","R13":"R13",
  "R1336mzz":"R1336mzz(Z)","R134a":"R134a","R141b":"R141b","R142b":"R142b","R143a":"R143a","R152a":"R152A",
  "R170":"Ethane","R22":"R22","R227ea":"R227EA","R23":"R23","R236fa":"R236FA","R245fa":"R245fa","R290":"Propane",
  "R32":"R32","R600":"n-Butane","R600a":"IsoButane","R717":"Ammonia","R718":"Water","R744":"CO2"}
MELANGES = ["R404A","R407A","R407C","R407F","R407H","R410A","R417A","R422D","R438A","R442A","R448A","R449A","R450A",
  "R452A","R452B","R453A","R454B","R454C","R455A","R500","R502","R507A","R508B","R513A"]   # R514A absent de CoolProp : reste sur son équation
ALIAS = {"R1234ze": "R1234ze(E)"}
ESTIMES = set()

def etat(cle):
    if cle in PURS: return CoolProp.AbstractState("HEOS", PURS[cle])
    if cle == "R515B":   # R1234ze(E)/R227ea 91,1/8,9 % en masse
        a = CoolProp.AbstractState("HEOS", "R1234ze(E)&R227EA"); a.set_mass_fractions([0.911, 0.089]); return a
    for _ in range(10):
        try: return CoolProp.AbstractState("HEOS", cle + ".mix")
        except ValueError as e:   # couple sans paramètres publiés : règle de mélange simple (composants minoritaires)
            cas = re.search(r"\[([^,\]]+),([^\]]+)\]", str(e))
            if not cas: raise
            CP.apply_simple_mixing_rule(cas.group(1), cas.group(2), "linear"); ESTIMES.add(cle)
    raise SystemExit(cle + " : mélange impossible")

def psat(a, T, q):
    a.update(CoolProp.QT_INPUTS, q, T + 273.15); return a.p() / 1e5

def table(cle):
    a = etat(cle)
    try: tmin = a.Tmin() - 273.15
    except Exception: tmin = -80
    try: tc = a.T_critical() - 273.15
    except Exception: tc = 100
    t0 = max(-80, int(-(-tmin // 2) * 2))          # premier pair au-dessus du point triple
    pb, pd, T = [], [], t0
    while T <= min(tc - 1, 150):
        try: b, d = psat(a, T, 0), psat(a, T, 1)
        except Exception: break
        pb.append(float(f"{b:.4g}")); pd.append(float(f"{d:.4g}")); T += 2
    return {"t0": t0, "dt": 2, "pb": pb, "pd": pd}

tables = {}
for cle in list(PURS) + MELANGES + ["R515B"]:
    tb = table(cle)
    if len(tb["pb"]) < 5: raise SystemExit(cle + " : table trop courte")
    tables[cle] = tb
bloc = ("  // <TABLES-COOLPROP> — GÉNÉRÉ par outils/tables-coolprop.py (CoolProp " + CP.get_global_param_string("version") +
        "), ne pas modifier à la main.\n  // Pression absolue (bar) de bulle (pb) et de rosée (pd), de t0 °C par pas de dt K.\n"
        "  var TABLES_PT = " + json.dumps(tables, separators=(",", ":")) + ";\n"
        "  var ALIAS_PT = " + json.dumps(ALIAS) + ";\n  // </TABLES-COOLPROP>")
src = CERVEAU.read_text(encoding="utf-8")
src, n = re.subn(r"  // <TABLES-COOLPROP>.*?// </TABLES-COOLPROP>", lambda m: bloc, src, flags=re.S)
if n != 1: raise SystemExit("bloc TABLES-COOLPROP introuvable dans cerveau_v5.js")
CERVEAU.write_text(src, encoding="utf-8")
print("règle de mélange simple pour un couple minoritaire :", sorted(ESTIMES))
print(f"{len(tables)} fluides, {sum(len(t['pb']) for t in tables.values())} points, bloc {len(bloc)//1024} Ko")
